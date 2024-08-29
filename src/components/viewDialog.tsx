import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from 'next/link';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface EditViewDialogProps {
  project: { title: string; description: string; link: string };
  onClose: () => void;
  onEdit: () => void;
  onView: () => void;
  onDelete: (title: string) => void; // Add onDelete prop
}

export const EditViewDialog: React.FC<EditViewDialogProps> = ({ project, onClose, onView, onDelete }) => {
  const handleEdit = () => {
    console.log('Editing:', project.title);
    onClose(); 
  };
  const { data: session, status } = useSession();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete('/api/projects/add', {
          data: { title: project.title, email: session?.user?.email },
        });
        onDelete(project.title);
        onClose(); // Close dialog after deletion
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  return (
    <Dialog open={!!project} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
          <DialogDescription>
            {project.description}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>{project.description}</p>
        </div>
        <DialogFooter>
          <Link href={`/${encodeURIComponent(project.title)}/doc`}>
            <button className="px-4 py-2 rounded-xl border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200" onClick={handleEdit}>
              Edit
            </button>
          </Link>
          <Link href="/view/sample">
            <button className="px-4 py-2 rounded-xl border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200" onClick={onView}>
              View
            </button>
          </Link>
          <button className="px-4 py-2 rounded-xl border border-red-600 bg-red-600 text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200" onClick={handleDelete}>
            Delete
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
