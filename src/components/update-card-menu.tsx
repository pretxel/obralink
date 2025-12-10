"use client";

import { MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteProjectUpdate } from "@/app/actions";
import { useState } from "react";

interface Props {
  projectId: string;
  updateId: string;
}

export function UpdateCardMenu({ projectId, updateId }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar este avance? Esta acción es irreversible.")) return;
    
    setIsDeleting(true);
    try {
        const result = await deleteProjectUpdate(projectId, updateId);
        if (!result.success) {
            alert("Error al eliminar el avance.");
            setIsDeleting(false);
        }
        // If successful, the page will revalidate automatically
    } catch (e) {
        console.error(e);
        alert("Error al eliminar.");
        setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-primary"
          disabled={isDeleting}
        >
          <MoreVertical size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={handleDelete}
          className="text-destructive focus:text-destructive cursor-pointer"
          disabled={isDeleting}
        >
          <Trash2 size={14} className="mr-2" />
          Eliminar Avance
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
