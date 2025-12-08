"use client";

import { useActionState, useState } from "react"; // Next.js 16 / React 19 uses useActionState
import Link from "next/link";
import { ArrowLeft, Calendar, Camera, Upload, Loader2, AlertCircle } from "lucide-react";
import { createProjectUpdate } from "@/app/actions";

const initialState = {
  message: "",
};

export default function CreateUpdatePage({ params }: { params: { id: string } }) {
  const projectId = params.id;
  
  // Bind the projectId to the server action
  const createUpdateWithId = createProjectUpdate.bind(null, projectId);
  
  // useActionState matches the signature (action, initialState)
  const [state, formAction, isPending] = useActionState(createUpdateWithId, initialState);

  // Local state for UI feedback (stages)
  const [selectedStage, setSelectedStage] = useState("Demolicion");

  const stages = [ "Demolicion", "Cimentacion", "Estructura", "Instalaciones", "Acabados", "Entrega" ];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb / Header */}
      <div className="mb-8">
        <Link href={`/dashboard/projects/${projectId}`} className="inline-flex items-center text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] mb-4">
          <ArrowLeft size={16} className="mr-2" />
          Volver al proyecto
        </Link>
        <h1 className="text-3xl font-bold">Registrar Nuevo Avance</h1>
        <p className="text-[var(--color-text-muted)] mt-2">Completa la información para notificar a los interesados.</p>
      </div>

      <form action={formAction} className="space-y-8">
        
        {state?.message && (
          <div className="p-4 bg-red-50 text-red-600 rounded-md flex items-center gap-2">
            <AlertCircle size={20} />
            <p>{state.message}</p>
          </div>
        )}

        {/* Main Card */}
        <div className="card bg-[var(--color-background)] p-6 md:p-8">
          
          {/* Title & Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="form-group">
              <label htmlFor="title" className="label">Título del Avance</label>
              <input 
                type="text" 
                name="title"
                id="title" 
                className="input" 
                placeholder="Ej. Finalización de cimientos" 
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="date" className="label">Fecha</label>
              <div className="relative">
                <input 
                  type="date" 
                  name="date"
                  id="date" 
                  className="input pl-10" 
                  defaultValue={new Date().toISOString().split('T')[0]}
                  required
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
              </div>
            </div>
          </div>

          {/* Stage Selection - Hidden Input for Form Submission + UI Buttons */}
          <div className="form-group mb-6">
            <label className="label">Etapa de la Obra</label>
            <input type="hidden" name="stage" value={selectedStage} />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {stages.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedStage(s)}
                  className={`
                    px-4 py-3 rounded-md text-sm font-medium border transition-all text-center
                    ${selectedStage === s 
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-md' 
                      : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] bg-[var(--color-background)]'}
                  `}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="form-group mb-6">
            <label htmlFor="description" className="label">Descripción Detallada</label>
            <textarea 
              name="description"
              id="description" 
              className="textarea" 
              placeholder="Describe los trabajos realizados..."
              rows={4}
            />
          </div>

          {/* Photos Upload (Still Visual Only for now) */}
          <div className="form-group">
            <label className="label mb-2 block">Evidencia Fotográfica</label>
            <div className="upload-zone group">
              <div className="h-12 w-12 rounded-full bg-[hsla(var(--primary-h),var(--primary-s),var(--primary-l),0.05)] flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                <Camera size={24} />
              </div>
              <div>
                <span className="text-[var(--color-primary)] font-medium">Sube fotos o vídeos</span>
                <span className="text-[var(--color-text-muted)]"> (Aún no conectado a S3)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link href={`/dashboard/projects/${projectId}`} className="btn btn-outline px-6">Cancelar</Link>
          <button 
            type="submit" 
            disabled={isPending}
            className="btn btn-primary px-8 h-11 text-base shadow-lg shadow-blue-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
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
          </button>
        </div>

      </form>
    </div>
  );
}

