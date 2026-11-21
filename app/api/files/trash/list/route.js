import { NextResponse } from "next/server";
import { ListObjectsV2Command, HeadObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "../../../../../lib/supabase/server";
import { r2, R2_BUCKET } from "../../../../../lib/r2";
export const runtime = "nodejs";
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims?.sub) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    if (!R2_BUCKET) return NextResponse.json({ error: "Bucket não configurado." }, { status: 500 });
    const trashPrefix = `users/${data.claims.sub}/.trash/`;
    const result = await r2.send(new ListObjectsV2Command({ Bucket: R2_BUCKET, Prefix: trashPrefix, MaxKeys: 1000 }));
    const files = await Promise.all((result.Contents || []).map(async (file) => {
      const metadata = await r2.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: file.Key }));
      let originalKey = "";
      try { originalKey = Buffer.from(metadata.Metadata?.["original-key"] || "", "base64url").toString("utf8"); } catch { originalKey = ""; }
      return { key: file.Key, originalKey, name: originalKey.split("/").pop() || "Arquivo", size: file.Size, lastModified: file.LastModified, contentType: metadata.ContentType || "" };
    }));
    return NextResponse.json({ files, count: files.length });
  } catch (error) {
    console.error("Erro ao listar arquivos da Lixeira:", error);
    return NextResponse.json({ error: "Não foi possível consultar a Lixeira." }, { status: 500 });
  }
}