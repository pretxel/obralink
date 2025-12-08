"use client";

import { useState } from "react";
import { Lock, ArrowRight, MapPin, Calendar, Image as ImageIcon, ChevronRight } from "lucide-react";
import { MOCK_PROJECT, MOCK_UPDATES } from "@/data/mock";

export default function PublicSharePage({ params }: { params: { token: string } }) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);

  // Hardcoded for demo
  const DEMO_PASSWORD = "123";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DEMO_PASSWORD) {
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[var(--color-primary)] text-white mb-4 shadow-lg shadow-blue-900/20">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl font-bold mb-2">Acceso a Proyecto</h1>
            <p className="text-[var(--color-text-muted)]">
              Por favor revisa tu correo e introduce la contraseña temporal que te hemos enviado.
            </p>
          </div>

          <div className="card p-8 shadow-xl border-[var(--color-border)]">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="form-group">
                <label className="label mb-2">Contraseña de acceso</label>
                <input 
                  type="password" 
                  className={`input text-lg tracking-widest ${error ? 'border-red-500 focus:border-red-500' : ''}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
                {error && <span className="text-red-500 text-sm mt-1">Contraseña incorrecta</span>}
              </div>
              <button type="submit" className="btn btn-primary w-full h-12 text-base shadow-lg shadow-blue-900/20">
                Ver Avances <ArrowRight size={18} className="ml-2" />
              </button>
            </form>
          </div>
          
          <p className="text-center text-xs text-[var(--color-text-muted)] mt-8">
            Protegido por ObraLink Secure Share
          </p>
        </div>
      </div>
    );
  }

  // --- Authenticated View (Read Only Timeline) ---
  const project = MOCK_PROJECT;
  const updates = MOCK_UPDATES;

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-20">
      {/* Public Header */}
      <header className="bg-[var(--color-surface)] border-b sticky top-0 z-20 shadow-sm" style={{ borderColor: 'var(--color-border)' }}>
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 bg-[var(--color-primary)] rounded-md flex items-center justify-center text-white">
              <span className="text-xs">OL</span>
            </div>
            <span className="hidden sm:inline">ObraLink</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-[var(--color-text-muted)]">Estás viendo como invitado</div>
              <div className="font-bold text-sm truncate max-w-[150px]">{project.clientName}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Project Hero */}
      <div className="bg-[var(--color-surface)] border-b mb-8" style={{ borderColor: 'var(--color-border)' }}>
        <div className="container py-8 md:py-12">
           <div className="max-w-4xl mx-auto text-center">
             <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 mb-4 inline-block">
               En Construcción
             </span>
             <h1 className="text-2xl md:text-4xl font-bold mb-4">{project.name}</h1>
             <div className="flex items-center justify-center gap-6 text-[var(--color-text-muted)]">
               <div className="flex items-center gap-2">
                 <MapPin size={18} />
                 <span>{project.address}</span>
               </div>
               <div className="flex items-center gap-2 hidden sm:flex">
                 <Calendar size={18} />
                 <span>Iniciado: {new Date(project.startDate).toLocaleDateString()}</span>
               </div>
             </div>
           </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4">
         {/* Simple Timeline Stream */}
         <div className="space-y-8 relative">
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-[var(--color-border)] z-0"></div>

            {updates.map((update) => (
              <div key={update.id} className="relative pl-12 md:pl-24">
                {/* Node */}
                <div className="absolute left-2.5 md:left-[29px] top-6 w-3 h-3 rounded-full bg-[var(--color-primary)] ring-4 ring-[var(--color-background)] z-10"></div>
                
                {/* Date Label (Floating left on desktop) */}
                <div className="md:absolute md:left-[-120px] md:top-5 md:w-[120px] md:text-right md:pr-8 mb-2 md:mb-0">
                  <span className="text-sm font-bold text-[var(--color-text-muted)] block">
                    {new Date(update.date).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                    {update.stage}
                  </span>
                </div>

                {/* Content Card */}
                <div className="card hover:border-[var(--color-primary)] transition-colors">
                  <div className="p-5 md:p-6">
                    <h3 className="text-xl font-bold mb-3">{update.title}</h3>
                    <p className="text-[var(--color-text-muted)] leading-relaxed mb-4">
                      {update.description}
                    </p>
                    
                    {/* Media Grid */}
                    {update.images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                        {update.images.map((img, i) => (
                           <div key={i} className="aspect-video bg-gray-100 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors cursor-pointer">
                              <ImageIcon size={20} />
                           </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
         </div>

         <div className="text-center py-12">
            <p className="text-[var(--color-text-muted)] text-sm">Este es el comienzo del historial del proyecto.</p>
         </div>
      </div>
    </div>
  );
}
