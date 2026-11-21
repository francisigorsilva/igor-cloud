import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createClient } from "../../../../lib/supabase/server";
import { r2, R2_BUCKET } from "../../../../lib/r2";
export const runtime = "nodejs";
export async function GET(request) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims?.sub) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    if (!R2_BUCKET) return NextResponse.json({ error: "Bucket não configurado." }, { status: 500 });
    const key = request.nextUrl.searchParams.get("key");
    const userPrefix = `users/${data.claims.sub}/`;
    if (!key || !key.startsWith(userPrefix) || key.length > 1024) return NextResponse.json({ error: "Arquivo inválido ou não autorizado." }, { status: 403 });
    const fileName = key.split("/").pop();
    const command = new GetObjectCommand({ Bucket: R2_BUCKET, Key: key, ResponseContentDisposition: `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}` });
    const downloadUrl = await getSignedUrl(r2, command, { expiresIn: 300 });
    return NextResponse.json({ downloadUrl, expiresIn: 300 });
  } catch (error) {
    console.error("Erro ao gerar URL de download:", error);
    return NextResponse.json({ error: "Não foi possível preparar o download." }, { status: 500 });
  }
}