export interface Project {
    id: string;
    name: string;
    address: string;
    clientName: string;
    startDate: string;
    status: 'active' | 'archived';
}

export interface ProgressUpdate {
    id: string;
    projectId: string;
    title: string;
    description: string;
    date: string;
    stage: 'Demolición' | 'Cimentación' | 'Estructura' | 'Instalaciones' | 'Acabados' | 'Entrega';
    images: string[];
    responsableId: string;
}
