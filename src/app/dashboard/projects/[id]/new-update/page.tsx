"use client";

import { useActionState, useState, use } from "react"; // Next.js 16 / React 19 uses useActionState
import Link from "next/link";
import { ArrowLeft, Calendar, Camera, Upload, Loader2, AlertCircle } from "lucide-react";
import { createProjectUpdate } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const initialState = {
  message: "",
};

export default function CreateUpdatePage({ params }: { params: Promise<{ id: string }> }) {
  const projectId = use(params).id;
  
  // Bind the projectId to the server action
  const createUpdateWithId = createProjectUpdate.bind(null, projectId);
  
  // useActionState matches the signature (action, initialState)
  const [state, formAction, isPending] = useActionState(createUpdateWithId, initialState);

  // Local state for UI feedback (stages)
  const [selectedStage, setSelectedStage] = useState("Demolicion");

  const stages = [ "Demolicion", "Cimentacion", "Estructura", "Instalaciones", "Acabados", "Entrega" ];

  return (
    <div className="max-w-3xl mx-auto container py-8">
      {/* Breadcrumb / Header */}
      <div className="mb-8 pl-1">
        <Button variant="link" className="pl-0 text-muted-foreground hover:text-primary mb-2" asChild>
          <Link href={`/dashboard/projects/${projectId}`}>
            <ArrowLeft size={16} className="mr-2" />
            Volver al proyecto
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Registrar Nuevo Avance</h1>
        <p className="text-muted-foreground mt-2">Completa la información para notificar a los interesados.</p>
      </div>

      <form action={formAction} className="space-y-8">
        
        {state?.message && (
          <div className="p-4 bg-red-50 text-red-600 rounded-md flex items-center gap-2 border border-red-100">
            <AlertCircle size={20} />
            <p>{state.message}</p>
          </div>
        )}

        {/* Main Card */}
        <Card>
          <CardContent className="p-6 md:p-8 space-y-6">
            
            {/* Title & Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="title">Título del Avance</Label>
                <Input 
                  type="text" 
                  name="title"
                  id="title" 
                  placeholder="Ej. Finalización de cimientos" 
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="date">Fecha</Label>
                <div className="relative">
                  <Input 
                    type="date" 
                    name="date"
                    id="date" 
                    className="pl-10" 
                    defaultValue={new Date().toISOString().split('T')[0]}
                    required
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                </div>
              </div>
            </div>

            {/* Stage Selection - Hidden Input for Form Submission + UI Buttons */}
            <div className="grid gap-3">
              <Label>Etapa de la Obra</Label>
              <input type="hidden" name="stage" value={selectedStage} />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {stages.map((s) => (
                  <Button
                    key={s}
                    type="button"
                    variant={selectedStage === s ? "default" : "outline"}
                    onClick={() => setSelectedStage(s)}
                    className={`h-auto py-3 ${selectedStage !== s ? "text-muted-foreground hover:text-primary hover:border-primary" : ""}`}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción Detallada</Label>
              <Textarea 
                name="description"
                id="description" 
                placeholder="Describe los trabajos realizados..."
                rows={4}
                className="min-h-[120px]"
              />
            </div>

            {/* Photos Upload */}
            <div className="grid gap-2">
              <Label htmlFor="images">Evidencia Fotográfica</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center gap-4 text-center hover:border-primary hover:bg-primary/5 transition-colors group relative">
                <input 
                  type="file" 
                  name="images" 
                  id="images" 
                  multiple 
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Camera size={24} />
                </div>
                <div>
                  <span className="text-primary font-medium">Click para subir fotos</span>
                  <span className="text-muted-foreground text-sm block mt-1">Soporta múltiples imágenes</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" size="lg" asChild>
            <Link href={`/dashboard/projects/${projectId}`}>Cancelar</Link>
          </Button>
          <Button 
            type="submit" 
            size="lg"
            disabled={isPending}
            className="shadow-lg shadow-primary/20"
          >
            {isPending ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Upload size={18} className="mr-2" />
                Publicar Avance
              </>
            )}
          </Button>
        </div>

      </form>
    </div>
  );
}
