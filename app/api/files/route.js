import { NextResponse } from "next/server";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { createClient } from "../../../lib/supabase/server";
import { r2, R2_BUCKET } from "../../../lib/r2";
export const runtime = "nodejs";
export async function GET(request) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims?.sub) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    if (!R2_BUCKET) return NextResponse.json({ error: "Bucket não configurado." }, { status: 500 });
    const { searchParams } = new URL(request.url);
    const browsingFolders = searchParams.has("folder");
    const folderPath = searchParams.get("folder") || "";
    const folderSegments = folderPath ? folderPath.split("/") : [];
    const invalidFolderPath = folderPath.length > 500 || folderSegments.some((segment) => !segment || segment === "." || segment === ".." || segment === ".trash" || segment === ".folder" || /[\\:*?"<>|\r\n]/.test(segment));
    if (invalidFolderPath) return NextResponse.json({ error: "Caminho da pasta inválido." }, { status: 400 });
    const userPrefix = `users/${data.claims.sub}/`;
    const folderPrefix = folderPath ? `${userPrefix}${folderPath}/` : userPrefix;
    const result = await r2.send(new ListObjectsV2Command({ Bucket: R2_BUCKET, Prefix: folderPrefix, Delimiter: browsingFolders ? "/" : undefined, MaxKeys: 1000 }));
    const trashPrefix = `${userPrefix}.trash/`;
    const folders = (result.CommonPrefixes || []).filter((folder) => folder.Prefix && !folder.Prefix.startsWith(trashPrefix)).map((folder) => {
      const path = folder.Prefix.slice(userPrefix.length).replace(/\/$/, "");
      return { name: path.split("/").pop(), path, type: "folder" };
    });
    const files = (result.Contents || []).filter((file) => !file.Key.startsWith(trashPrefix) && !file.Key.endsWith("/.folder")).map((file) => ({ key: file.Key, size: file.Size, lastModified: file.LastModified }));
    return NextResponse.json({ files, folders });
  } catch (error) {
    console.error("Erro ao listar arquivos:", error);
    return NextResponse.json({ error: "Não foi possível carregar os arquivos." }, { status: 500 });
  }
}