"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// import { Stage } from "@prisma/client"; // Removed to avoid lint error until restart
type Stage = "Demolicion" | "Cimentacion" | "Estructura" | "Instalaciones" | "Acabados" | "Entrega";

import { put } from "@vercel/blob";

// Tip: In a real app, validate with Zod
export async function createProjectUpdate(projectId: string, prevState: any, formData: FormData) {

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const dateStr = formData.get("date") as string;
    const stage = formData.get("stage") as Stage;

    // Extract files (can be multiple)
    const files = formData.getAll("images") as File[];

    // Basic validation
    if (!title || !dateStr || !stage) {
        return { message: "Faltan campos obligatorios" };
    }

    // Upload images to Vercel Blob
    const imageUrls: string[] = [];
    if (files.length > 0 && files[0].size > 0) {
        try {
            const uploadPromises = files.map(file =>
                put(`projects/${projectId}/${file.name}`, file, { access: 'public' })
            );
            const blobResults = await Promise.all(uploadPromises);
            blobResults.forEach(blob => imageUrls.push(blob.url));
        } catch (error) {
            console.error("Blob Upload Error:", error);
            return { message: "Hubo un error subiendo las imágenes." };
        }
    }

    // Ensure project exists (or handle error gracefully)
    // For this demo, if using a mock ID "1", this might fail if DB is empty.
    // We'll try-catch it.

    try {
        // Note: This relies on the project 'projectId' actually existing in the DB.
        // If you are using the ID "1" from the URL and it's not in Postgres, this throws.

        await prisma.progressUpdate.create({
            data: {
                projectId,
                title,
                description,
                date: new Date(dateStr),
                stage: stage,
                images: imageUrls,
                responsableId: "demo-user", // Hardcoded for prototype
            },
        });

        revalidatePath(`/dashboard/projects/${projectId}`);
    } catch (e) {
        console.error("Database Error:", e);
        return { message: "Error al guardar en base de datos. Asegúrate de tener el proyecto creado." };
    }

    redirect(`/dashboard/projects/${projectId}`);
}

export async function createDemoProject() {
    try {
        // Check if demo project exists or create it
        const existing = await prisma.project.findFirst({
            where: { name: "Residencia Villa Verde - Demo" }
        });

        if (existing) return existing;

        const project = await prisma.project.create({
            data: {
                name: "Residencia Villa Verde - Demo",
                address: "Calle Falsa 123",
                clientName: "Cliente Demo",
                startDate: new Date(),
                status: "ACTIVE"
            }
        });
        return project;
    } catch (error) {
        console.error("Failed to seed demo project:", error);
        throw error;
    }
}
