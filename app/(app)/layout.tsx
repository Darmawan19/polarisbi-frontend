import { Sidebar } from "@/components/cockpit/sidebar";
import { Header } from "@/components/cockpit/header";

/**
 * Kerangka aplikasi untuk semua halaman setelah login: sidebar kiri + header
 * atas. Layout ini tetap terpasang saat berpindah halaman; hanya `children`
 * yang berganti. Halaman login berada di luar route group ini.
 */
export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        <main id="main-content" tabIndex={-1} className="flex-1 min-h-0 overflow-auto relative focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
