import DashboardLayout from "../components/DashboardLayout";
import FileList from "../components/FileList";
export default function RecentesPage() {
  return <DashboardLayout activePage="recent"><FileList mode="recent" /></DashboardLayout>;
}