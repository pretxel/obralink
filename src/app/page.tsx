import Link from "next/link";
import { ArrowRight, BarChart3, Lock, Image as ImageIcon, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-[var(--color-primary)] rounded-md flex items-center justify-center text-white">
              <BarChart3 size={20} />
            </div>
            <span>ObraLink</span>
          </div>
          <nav className="flex gap-4">
            <Link href="/login" className="btn btn-outline text-sm">
              Iniciar Sesión
            </Link>
            <Link href="/register" className="btn btn-primary text-sm">
              Registrarse
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-[var(--color-surface)]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="inline-block rounded-lg bg-[hsl(var(--primary-h),var(--primary-s),96%)] px-3 py-1 text-sm text-[var(--color-primary)] font-medium">
                Nueva Plataforma 2024
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none max-w-3xl">
                Mantén a tus clientes <br/>
                <span style={{ color: 'var(--color-accent)' }}>conectados con la obra</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-[var(--color-text-muted)] md:text-xl">
                Comparte avances, fotos y documentos en una línea de tiempo visual. 
                Sin correos perdidos, sin WhatsApps desordenados.
              </p>
              <div className="space-x-4 pt-4">
                <Link href="/demo" className="btn btn-primary h-11 px-8">
                  Ver Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link href="/pricing" className="btn btn-outline h-11 px-8">
                  Precios
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Feature 1 */}
              <div className="card">
                <div className="h-12 w-12 rounded-lg bg-[hsl(var(--primary-h),var(--primary-s),96%)] flex items-center justify-center mb-4 text-[var(--color-primary)]">
                  <ImageIcon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Galería Multimedia</h3>
                <p className="text-[var(--color-text-muted)]">
                  Sube fotos y vídeos ilimitados de cada etapa. Organizado por fecha y accesible desde cualquier dispositivo.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="card">
                <div className="h-12 w-12 rounded-lg bg-[hsl(var(--primary-h),var(--primary-s),96%)] flex items-center justify-center mb-4 text-[var(--color-primary)]">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Línea de Tiempo</h3>
                <p className="text-[var(--color-text-muted)]">
                  Visualiza el progreso de la obra cronológicamente. Tus clientes sabrán exactamente qué está pasando.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="card">
                <div className="h-12 w-12 rounded-lg bg-[hsl(var(--primary-h),var(--primary-s),96%)] flex items-center justify-center mb-4 text-[var(--color-primary)]">
                  <Lock size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Acceso Seguro</h3>
                <p className="text-[var(--color-text-muted)]">
                  Comparte enlaces únicos protegidos con contraseña. Controla quién ve qué y cuándo expira el acceso.
                </p>
              </div>
              
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-6 md:px-8 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--color-text-muted)]">
          <p>© 2024 ObraLink. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="#">Términos</Link>
            <Link href="#">Privacidad</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
