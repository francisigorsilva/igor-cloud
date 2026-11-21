import DashboardLayout from "../components/DashboardLayout";
import FileList from "../components/FileList";
export default function ArquivosPage() {
  return <DashboardLayout activePage="files"><FileList mode="all" /></DashboardLayout>;
}