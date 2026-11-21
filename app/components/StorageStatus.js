"use client";
import { useEffect,useState } from "react";
export default function StorageStatus(){
 const [status,setStatus]=useState("checking");
 useEffect(()=>{const controller=new AbortController();async function checkStorage(){try{const response=await fetch("/api/files",{cache:"no-store",signal:controller.signal});if(response.status===401){setStatus("unauthenticated");return;}if(!response.ok){setStatus("unavailable");return;}setStatus("connected");}catch(error){if(error.name!=="AbortError")setStatus("unavailable");}}checkStorage();return()=>controller.abort();},[]);
 const labels={checking:"Verificando armazenamento...",connected:"Armazenamento conectado",unavailable:"Armazenamento indisponível",unauthenticated:"Sessão não autenticada"};
 return <span className={`status status-${status}`} role="status" aria-live="polite"><i aria-hidden="true" />{labels[status]}</span>;
}