"use client";

import { useActionState, useState, use, useEffect, startTransition } from "react"; // Next.js 16 / React 19 uses useActionState
import Link from "next/link";
import { ArrowLeft, Calendar, Camera, Upload, Loader2, AlertCircle, X, Image as ImageIcon, FileText } from "lucide-react";
import { upload } from "@vercel/blob/client";
import { createProjectUpdate } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
  const [previews, setPreviews] = useState<{url: string, type: string, name: string}[]>([]);
  
  // Upload Progress State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const stages = [ "Demolicion", "Cimentacion", "Estructura", "Instalaciones", "Acabados", "Entrega" ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews: {url: string, type: string, name: string}[] = [];
      Array.from(files).forEach((file) => {
        newPreviews.push({
          url: URL.createObjectURL(file),
          type: file.type,
          name: file.name
        });
      });
      setPreviews(newPreviews);
    }
  };

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Manual client-side validation for required fields if needed, 
    // but browser 'required' attr handles most.

    // Handle File Uploads
    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
    const files = fileInput?.files;

    if (files && files.length > 0) {
      setIsUploading(true);
      setUploadProgress(0);
      
      const newUrls: string[] = [];
      const totalBytes = Array.from(files).reduce((acc, file) => acc + file.size, 0);
      const fileProgress = new Map<number, number>(); // Index -> Loaded Bytes

      try {
        await Promise.all(Array.from(files).map(async (file, index) => {
             const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${file.name}`;
             const blob = await upload(uniqueFilename, file, {
               access: 'public',
               handleUploadUrl: '/api/upload',
               onUploadProgress: (progressEvent) => {
                  fileProgress.set(index, progressEvent.loaded);
                  
                  let totalLoaded = 0;
                  for (const loaded of fileProgress.values()) {
                    totalLoaded += loaded;
                  }
                  
                  const percent = totalBytes > 0 ? Math.round((totalLoaded / totalBytes) * 100) : 0;
                  setUploadProgress(percent);
               },
             });
             newUrls.push(blob.url);
        }));

        // Remove the original raw files from formData so we don't upload twice (fail-safe)
        formData.delete("images"); // We assume the server action checks imageUrls now
        // Append the new URLs
        newUrls.forEach(url => formData.append("imageUrls", url));

      } catch (error) {
        console.error("Client Upload Failed:", error);
        alert("Error subiendo archivos. Por favor intenta de nuevo.");
        setIsUploading(false);
        return; // Don't submit the form if upload failed
      }
      
      setIsUploading(false);
    }

    // Submit the form data to the Server Action
    startTransition(() => {
      formAction(formData);
    });
  };

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

      <form onSubmit={handleSubmit} className="space-y-8">
        
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

            {/* Files Upload */}
            <div className="grid gap-2">
              <Label htmlFor="images">Archivos Adjuntos</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center gap-4 text-center hover:border-primary hover:bg-primary/5 transition-colors group relative">
                <input 
                  type="file" 
                  name="images" 
                  id="images" 
                  multiple 
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  onChange={handleFileChange}
                />
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Upload size={24} />
                </div>
                <div>
                  <span className="text-primary font-medium">Click para subir archivos</span>
                  <span className="text-muted-foreground text-sm block mt-1">Soporta cualquier tipo de archivo</span>
                </div>
              </div>

              {/* Progress Bar */}
              {isUploading && (
                <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Subiendo archivos...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {/* Previews Grid */}
              {previews.length > 0 && !isUploading && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {previews.map((file, index) => (
                    <div key={index} className="relative aspect-square bg-muted rounded-md overflow-hidden border border-border flex flex-col items-center justify-center p-2 group">
                      {file.type.startsWith('image/') ? (
                         <img src={file.url} alt={`Preview ${index}`} className="object-cover w-full h-full absolute inset-0" />
                      ) : (
                         <div className="flex flex-col items-center justify-center text-center p-2 w-full h-full z-10">
                            <FileText size={32} className="mb-2 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground break-all line-clamp-2">{file.name}</span>
                         </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" size="lg" asChild disabled={isUploading || isPending}>
            <Link href={`/dashboard/projects/${projectId}`}>Cancelar</Link>
          </Button>
          <Button 
            type="submit" 
            size="lg"
            disabled={isPending || isUploading}
            className="shadow-lg shadow-primary/20"
          >
            {isPending || isUploading ? (
              <>
                <Loader2 size={18} className="mr-2 animate-spin" />
                {isUploading ? "Subiendo..." : "Guardando..."}
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
