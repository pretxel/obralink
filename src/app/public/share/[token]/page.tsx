"use client";

import { useState } from "react";
import { Lock, ArrowRight, MapPin, Calendar, Image as ImageIcon, ChevronRight } from "lucide-react";
import { MOCK_PROJECT, MOCK_UPDATES } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary text-primary-foreground mb-4 shadow-lg shadow-primary/20">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl font-bold mb-2 tracking-tight">Acceso a Proyecto</h1>
            <p className="text-muted-foreground">
              Por favor revisa tu correo e introduce la contraseña temporal que te hemos enviado.
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
  const project = MOCK_PROJECT;
  const updates = MOCK_UPDATES;

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
               En Construcción
             </Badge>
             <h1 className="text-2xl md:text-4xl font-bold mb-4 tracking-tight">{project.name}</h1>
             <div className="flex items-center justify-center gap-6 text-muted-foreground">
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
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-border z-0"></div>

            {updates.map((update) => (
              <div key={update.id} className="relative pl-12 md:pl-24">
                {/* Node */}
                <div className="absolute left-2.5 md:left-[29px] top-6 w-3 h-3 rounded-full bg-primary ring-4 ring-background z-10"></div>
                
                {/* Date Label (Floating left on desktop) */}
                <div className="md:absolute md:left-[-120px] md:top-5 md:w-[120px] md:text-right md:pr-8 mb-2 md:mb-0">
                  <span className="text-sm font-bold text-muted-foreground block">
                    {new Date(update.date).toLocaleDateString()}
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
                        {update.images.map((img, i) => (
                           <div key={i} className="aspect-video bg-muted rounded-md flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors cursor-pointer">
                              <ImageIcon size={20} />
                           </div>
                        ))}
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
