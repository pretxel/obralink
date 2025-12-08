import Link from "next/link";
import { LayoutDashboard, FolderKanban, Users, Settings, LogOut } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      {/* Sidebar */}
      <aside className="w-64 border-r hidden md:flex flex-col" style={{ borderColor: 'var(--color-border)' }}>
        <div className="h-16 flex items-center px-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <span className="font-bold text-xl">ObraLink</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)] rounded-md transition-colors">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/dashboard/projects" className="flex items-center gap-3 px-3 py-2 bg-[hsla(var(--primary-h),var(--primary-s),var(--primary-l),0.05)] text-[var(--color-primary)] rounded-md font-medium">
            <FolderKanban size={20} />
            <span>Proyectos</span>
          </Link>
          <Link href="/dashboard/team" className="flex items-center gap-3 px-3 py-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)] rounded-md transition-colors">
            <Users size={20} />
            <span>Equipo</span>
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface)] rounded-md transition-colors">
            <Settings size={20} />
            <span>Configuración</span>
          </Link>
        </nav>

        <div className="p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <button className="flex items-center gap-3 px-3 py-2 w-full text-[var(--color-text-muted)] hover:text-red-500 transition-colors">
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center justify-between px-6 md:px-8" style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="font-medium text-lg">Panel de Control</h2>
          <div className="h-8 w-8 rounded-full bg-[var(--color-border)]"></div>
        </header>
        <main className="p-6 md:p-8 overflow-y-auto flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
