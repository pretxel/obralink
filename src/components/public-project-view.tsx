"use client";

import { useState } from "react";
import { Lock, ArrowRight, MapPin, Calendar, Image as ImageIcon, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { authenticateShareAccess } from "@/app/actions";

interface Props {
  project: any;
  updates: any[];
  initialAuthenticated?: boolean;
}

export default function PublicProjectView({ project, updates, initialAuthenticated = false }: Props) {
  const [password, setPassword] = useState("");
  // Don't rely on client-side env var for validation anymore, use server action
  // const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD || "123"; 

  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthenticated);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    
    try {
        const result = await authenticateShareAccess(password, project.shareToken);
        if (result.success) {
            setIsAuthenticated(true);
        } else {
            setError(true);
        }
    } catch (err) {
        console.error(err);
        setError(true);
    } finally {
        setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary text-primary-foreground mb-4 shadow-lg shadow-primary/20">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl font-bold mb-2 tracking-tight">Acceso a Proyecto</h1>
            <p className="text-muted-foreground">
              Por favor introduce el código de acceso para visualizar el proyecto <strong>{project.name}</strong>.
            </p>
          </div>

          <Card className="shadow-xl">
            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña de acceso</Label>
                  <Input 
                    id="password"
                    type="password" 
                    className={`text-lg tracking-widest ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                  />
                  {error && <span className="text-destructive text-sm mt-1">Contraseña incorrecta</span>}
                </div>
                <Button type="submit" size="lg" className="w-full shadow-lg shadow-primary/20">
                  Ver Avances <ArrowRight size={18} className="ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <p className="text-center text-xs text-muted-foreground mt-8">
            Protegido por ObraLink Secure Share
          </p>
        </div>
      </div>
    );
  }

  // --- Authenticated View (Read Only Timeline) ---
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Public Header */}
      <header className="bg-card border-b sticky top-0 z-20 shadow-sm">
        <div className="container h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
              <span className="text-xs">OL</span>
            </div>
            <span className="hidden sm:inline">ObraLink</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-muted-foreground">Estás viendo como invitado</div>
              <div className="font-bold text-sm truncate max-w-[150px]">{project.clientName}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Project Hero */}
      <div className="bg-card border-b mb-8 shadow-sm">
        <div className="container py-8 md:py-12">
           <div className="max-w-4xl mx-auto text-center">
             <Badge variant="secondary" className="mb-4 bg-green-100 text-green-800 hover:bg-green-100 border-none">
               {project.status === 'ACTIVE' ? 'En Construcción' : 'Completado'}
             </Badge>
             <h1 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight">{project.name}</h1>
             <div className="flex items-center justify-center gap-6 text-muted-foreground">
               <div className="flex items-center gap-2">
                 <MapPin size={18} />
                 <span>{project.address}</span>
               </div>
               <div className="flex items-center gap-2 hidden sm:flex">
                 <Calendar size={18} />
                 <span>Iniciado: {new Date(project.startDate).toLocaleDateString("es-ES", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
               </div>
             </div>
           </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4">
         {/* Simple Timeline Stream */}
         <div className="space-y-8 relative">
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-border z-0"></div>

            {updates.map((update) => (
              <div key={update.id} className="relative pl-12 md:pl-24">
                {/* Node */}
                <div className="absolute left-2.5 md:left-[29px] top-6 w-3 h-3 rounded-full bg-primary ring-4 ring-background z-10"></div>
                
                {/* Date Label (Floating left on desktop) */}
                <div className="md:absolute md:left-[-120px] md:top-5 md:w-[120px] md:text-right md:pr-8 mb-2 md:mb-0">
                  <span className="text-sm font-bold text-muted-foreground block">
                    {new Date(update.date).toLocaleDateString("es-ES", { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    {update.stage}
                  </span>
                </div>

                {/* Content Card */}
                <Card className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-5 md:p-6">
                    <h3 className="text-xl font-bold mb-3 tracking-tight">{update.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {update.description}
                    </p>
                    
                    {/* Media Grid */}
                    {update.images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                        {update.images.map((imgUrl: string, i: number) => {
                           const isImage = /\.(jpg|jpeg|png|webp|gif|bmp|svg)$/i.test(imgUrl);
                           return (
                             <div 
                               key={i} 
                               onClick={() => window.open(imgUrl, '_blank')}
                               className="aspect-video bg-muted rounded-md flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors cursor-pointer overflow-hidden border border-border group relative"
                               title="Click para ver/descargar"
                             >
                                {isImage ? (
                                   <>
                                     <img src={imgUrl} alt={`Evidencia ${i + 1}`} className="object-cover w-full h-full" />
                                     <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <div className="bg-black/50 text-white p-1 rounded-full">
                                          <ImageIcon size={16} />
                                        </div>
                                     </div>
                                   </>
                                ) : (
                                   <div className="flex flex-col items-center justify-center p-2 w-full">
                                      <FileText size={24} className="mb-1 text-primary/80" />
                                      <span className="text-[10px] text-center w-full truncate px-1 font-medium">{imgUrl.split('/').pop()}</span>
                                      <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground mt-1 group-hover:text-primary transition-colors">Descargar</span>
                                   </div>
                                )}
                             </div>
                           );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
         </div>

         <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">Este es el comienzo del historial del proyecto.</p>
         </div>
      </div>
    </div>
  );
}
