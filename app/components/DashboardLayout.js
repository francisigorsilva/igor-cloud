import LogoutButton from "./LogoutButton";
import StorageStatus from "./StorageStatus";
export default function DashboardLayout({ activePage, children }) {
  return <main className="dashboard"><aside className="sidebar"><div className="brand"><span className="brand-icon">I</span><span>IGOR CLOUD</span></div><nav>
    <a className={activePage === "overview" ? "active" : ""} href="/">Visão geral</a>
    <a className={activePage === "files" ? "active" : ""} href="/arquivos">Meus arquivos</a>
    <a href="#">Compartilhados</a>
    <a className={activePage === "recent" ? "active" : ""} href="/recentes">Recentes</a>
    <a className={activePage === "trash" ? "active" : ""} href="/lixeira">Lixeira</a>
  </nav><div className="sidebar-footer"><span>PROJETO PESSOAL</span><p>Construído com tecnologia independente.</p></div></aside>
  <section className="content"><header className="topbar"><span>Meu espaço</span><div className="topbar-actions"><StorageStatus /><LogoutButton /></div></header>{children}<footer>IGOR CLOUD · Seu espaço, suas regras.</footer></section></main>;
}