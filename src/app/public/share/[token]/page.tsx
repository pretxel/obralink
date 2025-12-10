import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PublicProjectView from "@/components/public-project-view";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic'; // Prevent static generation issues with params if needed, though dynamic params usually auto-opt out.

export default async function PublicSharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  // 1. Fetch project by shareToken
  const project = await prisma.project.findUnique({
    where: { shareToken: token },
  });

  if (!project) {
    return notFound();
  }

  // 2. Check for auth cookie
  const cookieStore = await cookies();
  const isPreAuthenticated = cookieStore.get(`share_success_${token}`)?.value === 'true';

  // 3. Fetch updates for this project
  const updates = await prisma.progressUpdate.findMany({
    where: { projectId: project.id },
    orderBy: { date: 'desc' },
  });

  // 4. Render client view
  return (
    <PublicProjectView project={project} updates={updates} initialAuthenticated={isPreAuthenticated} />
  );
}
