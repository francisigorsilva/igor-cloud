import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
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
    const result = await r2.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    if (!result.Body) return NextResponse.json({ error: "Arquivo não encontrado." }, { status: 404 });
    const MAX_TEXT_SIZE = 1024 * 1024;
    if (result.ContentLength > MAX_TEXT_SIZE) {
      result.Body.destroy?.();
      return NextResponse.json({ error: "Arquivo muito grande para visualização. Faça o download para abrir." }, { status: 413 });
    }
    const text = await result.Body.transformToString("utf-8");
    return NextResponse.json({ text });
  } catch (error) {
    console.error("Erro ao ler arquivo de texto:", error);
    return NextResponse.json({ error: "Não foi possível ler o arquivo." }, { status: 500 });
  }
}