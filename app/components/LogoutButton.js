"use client";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import { useState } from "react";
export default function LogoutButton() {
  const router = useRouter(); const [loading,setLoading]=useState(false);
  async function handleLogout(){setLoading(true);const supabase=createClient();await supabase.auth.signOut();router.replace("/login");router.refresh();}
  return <button type="button" onClick={handleLogout} disabled={loading} className="logout-button">{loading ? "Saindo..." : "Sair"}</button>;
}