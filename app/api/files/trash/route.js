import { NextResponse } from "next/server";
import { CopyObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
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
    const key = typeof body.key === "string" ? body.key : "";
    const userPrefix = `users/${data.claims.sub}/`;
    const trashPrefix = `${userPrefix}.trash/`;
    if (!key || !key.startsWith(userPrefix) || key.startsWith(trashPrefix) || key.length > 1024) return NextResponse.json({ error: "Arquivo inválido ou não autorizado." }, { status: 403 });
    const original = await r2.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    const trashKey = `${trashPrefix}${randomUUID()}`;
    const encodedOriginalKey = Buffer.from(key, "utf8").toString("base64url");
    const copySource = encodeURIComponent(`${R2_BUCKET}/${key}`).replace(/%2F/g, "/");
    await r2.send(new CopyObjectCommand({ Bucket: R2_BUCKET, Key: trashKey, CopySource: copySource, MetadataDirective: "REPLACE", Metadata: { ...(original.Metadata || {}), "original-key": encodedOriginalKey }, ContentType: original.ContentType || "application/octet-stream", CacheControl: original.CacheControl, ContentDisposition: original.ContentDisposition, ContentEncoding: original.ContentEncoding, ContentLanguage: original.ContentLanguage, Expires: original.Expires }));
    await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    return NextResponse.json({ success: true, message: "Arquivo movido para a Lixeira." });
  } catch (error) {
    console.error("Erro ao mover arquivo para a Lixeira:", error);
    return NextResponse.json({ error: "Não foi possível mover o arquivo para a Lixeira." }, { status: 500 });
  }
}