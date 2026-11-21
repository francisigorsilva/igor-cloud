import { NextResponse } from "next/server";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "../../../../lib/supabase/server";
import { r2, R2_BUCKET } from "../../../../lib/r2";
export const runtime = "nodejs";
export async function DELETE(request) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims?.sub) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    if (!R2_BUCKET) return NextResponse.json({ error: "Bucket não configurado." }, { status: 500 });
    const body = await request.json();
    const key = typeof body.key === "string" ? body.key : "";
    const userPrefix = `users/${data.claims.sub}/`;
    const trashPrefix = `${userPrefix}.trash/`;
    if (!key || !key.startsWith(trashPrefix) || key === trashPrefix || key.length > 1024) return NextResponse.json({ error: "Arquivo inválido ou não autorizado." }, { status: 403 });
    await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    return NextResponse.json({ success: true, message: "Arquivo excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir arquivo:", error);
    return NextResponse.json({ error: "Não foi possível excluir o arquivo." }, { status: 500 });
  }
}