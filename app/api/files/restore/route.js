import { NextResponse } from "next/server";
import { CopyObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "../../../../lib/supabase/server";
import { r2, R2_BUCKET } from "../../../../lib/r2";
export const runtime = "nodejs";
export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims?.sub) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    if (!R2_BUCKET) return NextResponse.json({ error: "Bucket não configurado." }, { status: 500 });
    const body = await request.json();
    const trashKey = typeof body.key === "string" ? body.key : "";
    const userPrefix = `users/${data.claims.sub}/`;
    const trashPrefix = `${userPrefix}.trash/`;
    if (!trashKey || !trashKey.startsWith(trashPrefix) || trashKey.length > 1024) return NextResponse.json({ error: "Arquivo inválido ou não autorizado." }, { status: 403 });
    const trashedObject = await r2.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: trashKey }));
    const encodedOriginalKey = trashedObject.Metadata?.["original-key"];
    if (!encodedOriginalKey) return NextResponse.json({ error: "Não foi possível identificar o arquivo original." }, { status: 400 });
    const originalKey = Buffer.from(encodedOriginalKey, "base64url").toString("utf8");
    if (!originalKey || !originalKey.startsWith(userPrefix) || originalKey.startsWith(trashPrefix) || originalKey.length > 1024) return NextResponse.json({ error: "Caminho original inválido." }, { status: 400 });
    try {
      await r2.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: originalKey }));
      return NextResponse.json({ error: "Já existe um arquivo nesse caminho." }, { status: 409 });
    } catch (error) {
      const status = error.$metadata?.httpStatusCode;
      if (status !== 404 && error.name !== "NotFound" && error.name !== "NoSuchKey") throw error;
    }
    const copySource = encodeURIComponent(`${R2_BUCKET}/${trashKey}`).replace(/%2F/g, "/");
    const { ["original-key"]: removedMetadata, ...restMetadata } = trashedObject.Metadata || {};
    await r2.send(new CopyObjectCommand({ Bucket: R2_BUCKET, Key: originalKey, CopySource: copySource, MetadataDirective: "REPLACE", Metadata: restMetadata, ContentType: trashedObject.ContentType || "application/octet-stream", CacheControl: trashedObject.CacheControl, ContentDisposition: trashedObject.ContentDisposition, ContentEncoding: trashedObject.ContentEncoding, ContentLanguage: trashedObject.ContentLanguage, Expires: trashedObject.Expires }));
    await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: trashKey }));
    return NextResponse.json({ success: true, message: "Arquivo restaurado com sucesso." });
  } catch (error) {
    console.error("Erro ao restaurar arquivo:", error);
    return NextResponse.json({ error: "Não foi possível restaurar o arquivo." }, { status: 500 });
  }
}