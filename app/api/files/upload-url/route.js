import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
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
    const fileName = typeof body.fileName === "string" ? body.fileName.trim() : "";
    const contentType = typeof body.contentType === "string" && body.contentType.trim() ? body.contentType.trim() : "application/octet-stream";
    if (!fileName || fileName.length > 180 || /[\r\n]/.test(fileName) || contentType.length > 150 || /[\r\n]/.test(contentType)) return NextResponse.json({ error: "Dados do arquivo inválidos." }, { status: 400 });
    const safeFileName = fileName.replace(/[\\/]/g, "_");
    const folderPath = typeof body.folderPath === "string" ? body.folderPath.trim() : "";
    const folderSegments = folderPath ? folderPath.split("/") : [];
    const invalidFolderPath = folderPath.length > 500 || folderSegments.some((segment) => !segment || segment === "." || segment === ".." || segment === ".trash" || /[\\:*?"<>|\r\n]/.test(segment));
    if (invalidFolderPath) return NextResponse.json({ error: "Caminho da pasta inválido." }, { status: 400 });
    const userPrefix = `users/${data.claims.sub}/`;
    const folderPrefix = folderPath ? `${folderPath}/` : "";
    const key = `${userPrefix}${folderPrefix}${randomUUID()}-${safeFileName}`;
    const command = new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, ContentType: contentType });
    const uploadUrl = await getSignedUrl(r2, command, { expiresIn: 300 });
    return NextResponse.json({ uploadUrl, key, contentType, expiresIn: 300 });
  } catch (error) {
    console.error("Erro ao gerar URL de upload:", error);
    return NextResponse.json({ error: "Não foi possível preparar o upload." }, { status: 500 });
  }
}