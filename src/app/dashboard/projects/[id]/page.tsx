import Link from "next/link";
import { Plus, MapPin, Calendar, Clock, Download, MoreVertical, Image as ImageIcon, ChevronRight, FileText } from "lucide-react";
import prisma from "@/lib/prisma"; // Real DB import
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Define the component as async to allow server-side data fetching
export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const projectId = (await params).id;
  
  // Fetch real data from DB
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    return notFound();
  }

  // Fetch updates for this project
  const updates = await prisma.progressUpdate.findMany({
    where: { projectId: projectId },
    orderBy: { date: 'desc' },
  });

  const totalFiles = updates.reduce((acc, update) => acc + update.images.length, 0);

  // Calculate days in construction
  const start = new Date(project.startDate);
  const end = project.endDate ? new Date(project.endDate) : new Date();
  const daysInConstruction = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-5xl mx-auto container py-8">
      {/* Project Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={project.status === 'ACTIVE' ? "default" : "secondary"} className={project.status === 'ACTIVE' ? "bg-green-600 hover:bg-green-700" : ""}>
              {project.status === 'ACTIVE' ? 'En Progreso' : 'Archivado'}
            </Badge>
            <span className="text-muted-foreground text-sm">#{project.id.slice(-4)}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">{project.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              {project.address}
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              Inicio: {new Date(project.startDate).toLocaleDateString()}
            </div>
            {project.endDate && (
              <div className="flex items-center gap-1">
                <Clock size={16} />
                Fin: {new Date(project.endDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
           <Button variant="outline" asChild disabled={!project.shareToken}>
             <Link href={project.shareToken ? `/public/share/${project.shareToken}` : '#'} target="_blank" title="Ver como cliente">
               <Download size={20} className="mr-2" />
               Vista Cliente
             </Link>
           </Button>
           <Button asChild>
             <Link href={`/dashboard/projects/${projectId}/new-update`}>
               <Plus size={20} className="mr-2" />
               Nuevo Avance
             </Link>
           </Button>
        </div>
      </div>


      {/* Stats / Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <Card>
          <CardContent className="p-4 flex flex-col justify-between h-full">
             <span className="text-sm text-muted-foreground">Total Avances</span>
             <span className="text-2xl font-bold">{updates.length}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-between h-full">
             <span className="text-sm text-muted-foreground">Archivos</span>
             <span className="text-2xl font-bold">{totalFiles}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col justify-between h-full">
             <span className="text-sm text-muted-foreground">Días en Obra</span>
             <span className="text-2xl font-bold">{daysInConstruction}</span>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex flex-col justify-between h-full">
             <span className="text-sm text-muted-foreground">Próximo Hito</span>
             <span className="text-lg font-bold text-primary">Inst. Eléctrica</span>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Section */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border md:left-1/2 md:-ml-px"></div>

        <div className="space-y-12">
          {updates.map((update: any, index: number) => {
            const isEven = index % 2 === 0;
            return (
              <div key={update.id} className={`relative flex flex-col md:flex-row gap-6 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Date / Metadata Side */}
                <div className="md:w-1/2 flex flex-col justify-center px-4 md:px-0 text-left md:text-right">
       
                </div>

                {/* Center Node */}
                <div className="absolute left-4 md:left-1/2 -ml-2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10 shadow-sm mt-6 md:mt-6"></div>

                {/* Content Card Side */}
                <div className={`md:w-1/2 ml-10 md:ml-0 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                  
                  {/* Date Badge */}
                   <div className={`flex items-center mb-2 text-sm text-muted-foreground ${isEven ? 'md:justify-end' : ''}`}>
                      <Calendar size={14} className="mr-1" />
                      {new Date(update.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                   </div>

                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    {/* Card Header */}
                    <CardHeader className="p-4 pb-3 border-b">
                      <div className="flex justify-between items-start mb-1">
                        {/* Using custom orange for badge */}
                        <Badge className="bg-brand-orange hover:bg-brand-orange/90 text-white border-none">
                          {update.stage}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <MoreVertical size={16} />
                        </Button>
                      </div>
                      <CardTitle className="text-lg leading-tight">{update.title}</CardTitle>
                    </CardHeader>

                    {/* Card Body */}
                    <CardContent className="p-4 pt-3">
                      <p className="text-muted-foreground text-sm mb-4">
                        {update.description}
                      </p>

                      {/* Attachments / Media Preview */}
                      {update.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          {update.images.slice(0, 3).map((imgUrl: string, i: number) => {
                            const isImage = /\.(jpg|jpeg|png|webp|gif|bmp|svg)$/i.test(imgUrl);
                            return (
                              <div key={i} className="aspect-square bg-muted rounded-md overflow-hidden relative group cursor-pointer flex items-center justify-center border border-border">
                                 {/* Real Image or File Icon */}
                                 {isImage ? (
                                   <img src={imgUrl} alt={`Evidencia ${i + 1}`} className="object-cover w-full h-full" />
                                 ) : (
                                   <div className="flex flex-col items-center justify-center text-muted-foreground p-2 w-full h-full bg-background/50">
                                     <FileText size={28} className="mb-1" />
                                     <span className="text-[10px] uppercase font-bold tracking-wider">Archivo</span>
                                   </div>
                                 )}
                                 {/* Overlay */}
                                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                              </div>
                            );
                          })}
                          {update.images.length > 3 && (
                            <div className="aspect-square bg-muted rounded-md flex items-center justify-center text-xs font-bold text-muted-foreground cursor-pointer hover:bg-accent">
                              +{update.images.length - 3}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="flex items-center gap-3 pt-2">
                         {update.images.length === 0 && (
                            <div className="text-xs text-muted-foreground italic">Sin imágenes adjuntas</div>
                         )}
                         <div className="flex-1"></div>
                         <Button variant="link" className="text-primary p-0 h-auto font-medium" asChild>
                          <Link href={`/dashboard/projects/${projectId}/updates/${update.id}`}>
                           Ver Detalles <ChevronRight size={14} className="ml-1" />
                          </Link>
                         </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

              </div>
            );
          })}
        </div>
        
        {/* End of Timeline Node */}
        <div className="absolute left-4 md:left-1/2 -ml-2 bottom-0 w-4 h-4 rounded-full bg-border z-10"></div>
      </div>
    </div>
  );
}
