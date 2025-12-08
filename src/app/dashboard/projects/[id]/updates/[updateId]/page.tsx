import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma"; // Real DB import
import { ArrowLeft, Calendar, MapPin, Image as ImageIcon, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function UpdateDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string; updateId: string }> 
}) {
  const { id: projectId, updateId } = await params;

  // Fetch Update Details with Project Info
  const update = await prisma.progressUpdate.findUnique({
    where: { id: updateId },
    include: {
      project: true
    }
  });

  if (!update) {
    return notFound();
  }

  const project = update.project;

  return (
    <div className="max-w-4xl mx-auto container py-8">
      
      {/* Navigation Header */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" className="pl-0 hover:pl-2 transition-all" asChild>
          <Link href={`/dashboard/projects/${projectId}`}>
            <ArrowLeft size={16} className="mr-2" />
            Volver al Proyecto
          </Link>
        </Button>
        <div className="text-sm text-muted-foreground hidden sm:block">
          Proyecto: <span className="font-medium text-foreground">{project.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <Badge variant="outline" className="text-sm px-3 py-1 border-primary/20 text-primary bg-primary/5">
                  {update.stage}
                </Badge>
                <div className="flex items-center text-muted-foreground text-sm">
                   <Calendar size={16} className="mr-2" />
                   {new Date(update.date).toLocaleDateString("es-ES", { 
                     weekday: 'long', 
                     year: 'numeric', 
                     month: 'long', 
                     day: 'numeric' 
                   })}
                </div>
              </div>
              <CardTitle className="text-3xl font-bold leading-tight text-primary">
                {update.title}
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="prose prose-slate max-w-none dark:prose-invert">
                 <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed text-lg">
                   {update.description}
                 </p>
              </div>
            </CardContent>
          </Card>

          {/* Images Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center">
              <ImageIcon size={20} className="mr-2 text-primary" />
              Evidencia Fotográfica ({update.images.length})
            </h3>
            
            {update.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                {update.images.map((img: string, i: number) => (
                  <Card key={i} className="overflow-hidden border-none shadow-md group">
                    <div className="aspect-video bg-muted relative flex items-center justify-center">
                         <img src={img} alt={`Evidencia ${i + 1}`} className="object-cover w-full h-full" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-muted-foreground/20 rounded-lg text-center text-muted-foreground">
                <p>No se han adjuntado imágenes a este avance.</p>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Meta & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detalles del Hito</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                 <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Proyecto</div>
                 <div className="font-medium">{project.name}</div>
               </div>
               <Separator />
               <div>
                 <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Ubicación</div>
                 <div className="flex items-start text-sm">
                   <MapPin size={16} className="mr-1 mt-0.5 shrink-0" />
                   {project.address}
                 </div>
               </div>
               <Separator />
                <div className="pt-2">
                 <Button className="w-full" variant="outline">
                   <Share2 size={16} className="mr-2" />
                   Compartir Avance
                 </Button>
               </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
