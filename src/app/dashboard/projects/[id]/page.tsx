import Link from "next/link";
import { Plus, MapPin, Calendar, Clock, Download, MoreVertical, Image as ImageIcon, ChevronRight } from "lucide-react";
import prisma from "@/lib/prisma"; // Real DB import
import { notFound } from "next/navigation";

// Define the component as async to allow server-side data fetching
export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const projectId = params.id;
  
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

  return (
    <div className="max-w-5xl mx-auto">
      {/* Project Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide bg-green-100 text-green-700">
              {project.status === 'ACTIVE' ? 'En Progreso' : 'Archivado'}
            </span>
            <span className="text-[var(--color-text-muted)] text-sm">#{project.id.slice(-4)}</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-muted)]">
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
           <Link href={`/public/share/token123`} target="_blank" className="btn btn-outline" title="Ver como cliente (Simulado)">
             <Download size={20} className="mr-2" />
             Vista Cliente
           </Link>
           <Link href={`/dashboard/projects/${params.id}/new-update`} className="btn btn-primary">
             <Plus size={20} className="mr-2" />
             Nuevo Avance
           </Link>
        </div>
      </div>


      {/* Stats / Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="card p-4 flex flex-col justify-between">
           <span className="text-sm text-[var(--color-text-muted)]">Total Avances</span>
           <span className="text-2xl font-bold">{updates.length}</span>
        </div>
        <div className="card p-4 flex flex-col justify-between">
           <span className="text-sm text-[var(--color-text-muted)]">Archivos</span>
           <span className="text-2xl font-bold">12</span>
        </div>
        <div className="card p-4 flex flex-col justify-between">
           <span className="text-sm text-[var(--color-text-muted)]">Días en Obra</span>
           <span className="text-2xl font-bold">45</span>
        </div>
        <div className="card p-4 flex flex-col justify-between bg-[hsla(var(--primary-h),var(--primary-s),var(--primary-l),0.03)] border border-[hsla(var(--primary-h),var(--primary-s),var(--primary-l),0.1)]">
           <span className="text-sm text-[var(--color-text-muted)]">Próximo Hito</span>
           <span className="text-lg font-bold text-[var(--color-primary)]">Inst. Eléctrica</span>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[var(--color-border)] md:left-1/2 md:-ml-px"></div>

        <div className="space-y-12">
          {updates.map((update: any, index: number) => {
            const isEven = index % 2 === 0;
            return (
              <div key={update.id} className={`relative flex flex-col md:flex-row gap-6 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                
                {/* Date / Metadata Side */}
                <div className="md:w-1/2 flex flex-col justify-center px-4 md:px-0 text-left md:text-right">
       
                </div>

                {/* Center Node */}
                <div className="absolute left-4 md:left-1/2 -ml-2 w-4 h-4 rounded-full bg-[var(--color-primary)] border-4 border-[var(--color-background)] z-10 shadow-sm mt-6 md:mt-6"></div>

                {/* Content Card Side */}
                <div className={`md:w-1/2 ml-10 md:ml-0 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                  
                  {/* Date Badge (Mobile/Desktop consistent placement logic can vary, let's put it above card) */}
                   <div className={`flex items-center mb-2 text-sm text-[var(--color-text-muted)] ${isEven ? 'md:justify-end' : ''}`}>
                      <Calendar size={14} className="mr-1" />
                      {new Date(update.date).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                   </div>

                  <div className="card hover:shadow-lg transition-shadow duration-300">
                    {/* Card Header */}
                    <div className="border-b p-4 pb-3" style={{ borderColor: 'var(--color-border)' }}>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-[var(--color-accent)] text-white bg-opacity-90">
                          {update.stage}
                        </span>
                        <button className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)]">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                      <h3 className="font-bold text-lg leading-tight">{update.title}</h3>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 pt-3">
                      <p className="text-[var(--color-text-muted)] text-sm mb-4">
                        {update.description}
                      </p>

                      {/* Attachments / Media Preview */}
                      {update.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          {update.images.slice(0, 3).map((img: string, i: number) => (
                            <div key={i} className="aspect-square bg-gray-200 rounded-md overflow-hidden relative group cursor-pointer">
                              {/* Placeholder for actual image */}
                              <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                                <ImageIcon size={20} />
                              </div>
                              {/* Overlay */}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                            </div>
                          ))}
                          {update.images.length > 3 && (
                            <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center text-xs font-bold text-gray-500 cursor-pointer hover:bg-gray-200">
                              +{update.images.length - 3}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="flex items-center gap-3 pt-2">
                         {update.images.length === 0 && (
                            <div className="text-xs text-[var(--color-text-muted)] italic">Sin imágenes adjuntas</div>
                         )}
                         <div className="flex-1"></div>
                         <button className="text-xs font-medium text-[var(--color-primary)] flex items-center hover:underline">
                           Ver Detalles <ChevronRight size={14} />
                         </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
        
        {/* End of Timeline Node */}
        <div className="absolute left-4 md:left-1/2 -ml-2 bottom-0 w-4 h-4 rounded-full bg-[var(--color-border)] z-10"></div>
      </div>
    </div>
  );
}
