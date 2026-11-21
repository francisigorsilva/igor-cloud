import DashboardLayout from "./components/DashboardLayout";
import FileList from "./components/FileList";
export default function Home() {
  return (
    <DashboardLayout activePage="overview">
      <section className="welcome">
        <span className="eyebrow">SUA NUVEM PESSOAL</span>
        <h1>Seus arquivos.<br />Seu espaço.</h1>
        <p>Um lugar centralizado para guardar, organizar e acessar seus arquivos de qualquer dispositivo.</p>
      </section>
      <FileList mode="overview" />
    </DashboardLayout>
  );
}