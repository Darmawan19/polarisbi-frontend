import { AppShell } from "@/components/cockpit/app-shell";

/**
 * Kerangka aplikasi untuk semua halaman setelah login: header atas + sidebar
 * (panel yang dibuka dari tombol hamburger). Layout ini tetap terpasang saat
 * berpindah halaman; hanya `children` yang berganti. Halaman login berada di
 * luar route group ini.
 */
export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
