import { Project, ProgressUpdate } from "@/types";

export const MOCK_PROJECT: Project = {
    id: "1",
    name: "Residencia Villa Verde - Remodelación Total",
    address: "Av. Las Lomas 450, Ciudad Jardín",
    clientName: "Roberto Gómez",
    startDate: "2024-01-15",
    status: "active"
};

export const MOCK_UPDATES: ProgressUpdate[] = [
    {
        id: "u3",
        projectId: "1",
        title: "Instalación de Luminarias y Acabados Finales",
        description: "Se ha completado la instalación de toda la iluminación LED en sala y comedor. También se terminaron los detalles de pintura en la fachada principal. El cliente visitó la obra y aprobó los tonos elegidos.",
        date: "2024-03-10",
        stage: "Acabados",
        images: ["/placeholder-1.jpg", "/placeholder-2.jpg", "/placeholder-3.jpg"],
        responsableId: "admin"
    },
    {
        id: "u2",
        projectId: "1",
        title: "Vaciado de Piso y Contrapiso",
        description: "Se realizó el vaciado del contrapiso en el área de la terraza. Se verificaron niveles de pendiente para desagüe pluvial.",
        date: "2024-02-22",
        stage: "Estructura",
        images: ["/placeholder-4.jpg"],
        responsableId: "admin"
    },
    {
        id: "u1",
        projectId: "1",
        title: "Inicio de Demolición de Muros",
        description: "Comenzamos con la demolición de los muros divisorios de la cocina según el plano arquitectónico. Se ha retirado el escombro.",
        date: "2024-01-18",
        stage: "Demolición",
        images: [],
        responsableId: "admin"
    }
];
