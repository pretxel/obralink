"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteEvidence } from "@/app/actions";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface Props {
  imgUrl: string;
  projectId: string;
  updateId: string;
}

export function DeleteEvidenceButton({ imgUrl, projectId, updateId }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar este archivo?")) return;
    
    setIsDeleting(true);
    try {
        const result = await deleteEvidence(projectId, updateId, imgUrl);
        if (!result.success) {
            alert("Error al eliminar el archivo.");
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
      size="icon" 
      className="h-8 w-8 bg-red-500/80 hover:bg-red-600 shadow-sm"
      onClick={(e) => {
        e.preventDefault(); // Prevent opening image/link if parent has onClick
        e.stopPropagation();
        handleDelete();
      }}
      disabled={isDeleting}
      title="Eliminar evidencia"
    >
      {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
    </Button>
  );
}
