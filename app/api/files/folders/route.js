import { NextResponse } from "next/server";
import { ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
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
    const folderName = typeof body.folderName === "string" ? body.folderName.trim() : "";
    const parentPath = typeof body.parentPath === "string" ? body.parentPath.trim() : "";
    const invalidName = !folderName || folderName.length > 100 || folderName === "." || folderName === ".." || folderName === ".trash" || folderName === ".folder" || /[\\/:*?"<>|\r\n]/.test(folderName);
    const parentSegments = parentPath ? parentPath.split("/") : [];
    const invalidParent = parentPath.length > 500 || parentSegments.some((segment) => !segment || segment === "." || segment === ".." || segment === ".trash" || /[\\:*?"<>|\r\n]/.test(segment));
    if (invalidName || invalidParent) return NextResponse.json({ error: "Nome ou caminho da pasta inválido." }, { status: 400 });
    const userPrefix = `users/${data.claims.sub}/`;
    const folderPath = parentPath ? `${parentPath}/${folderName}` : folderName;
    const folderPrefix = `${userPrefix}${folderPath}/`;
    const existing = await r2.send(new ListObjectsV2Command({ Bucket: R2_BUCKET, Prefix: folderPrefix, MaxKeys: 1 }));
    if (existing.Contents?.length) return NextResponse.json({ error: "Já existe uma pasta ou arquivo com esse caminho." }, { status: 409 });
    await r2.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: `${folderPrefix}.folder`, Body: "", ContentType: "application/x-directory" }));
    return NextResponse.json({ success: true, folder: { name: folderName, path: folderPath, type: "folder" } });
  } catch (error) {
    console.error("Erro ao criar pasta:", error);
    return NextResponse.json({ error: "Não foi possível criar a pasta." }, { status: 500 });
  }
}