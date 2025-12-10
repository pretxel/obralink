"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProjectUpdate } from "@/app/actions";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  projectId: string;
  updateId: string;
}

export function DeleteUpdateButton({ projectId, updateId }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar este avance completo? Esta acción es irreversible.")) return;
    
    setIsDeleting(true);
    try {
        const result = await deleteProjectUpdate(projectId, updateId);
        if (result.success) {
            router.push(`/dashboard/projects/${projectId}`);
        } else {
            alert("Error al eliminar el avance.");
        }
    } catch (e) {
        console.error(e);
        alert("Error al eliminar.");
    } finally {
        setIsDeleting(false);
    }
  };

  return (
    <Button 
      variant="destructive" 
      onClick={handleDelete}
      disabled={isDeleting}
      className="w-full sm:w-auto"
    >
      {isDeleting ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Trash2 size={16} className="mr-2" />}
      Eliminar Avance
    </Button>
  );
}
