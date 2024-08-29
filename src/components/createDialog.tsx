// import React, { useState } from 'react';
// import axios from 'axios';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useSession } from 'next-auth/react';

// interface CreateDocumentationDialogProps {
//   addProject: (project: { title: string; description: string; link: string }) => void;
// }

// export function CreateDocumentationDialog({ addProject }: CreateDocumentationDialogProps) {
//   const { data: session } = useSession();
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');

//   const handleSave = async () => {
//     if (title.trim() && description.trim()) {
//       const sanitizedTitle = title.trim().toLowerCase().replace(/\s+/g, '-');
//       const link = `/doc/${sanitizedTitle}`;

//       try {
//         // Ensure session exists and get the email
//         const email = session?.user?.email;
//         if (!email) {
//           throw new Error('User not authenticated');
//         }

//         const response = await axios.post('/api/projects/add', {
//           title,
//           description,
//           link,
//           email,
//         });

//         const newProject = response.data;
//         addProject(newProject);
//         setTitle('');
//         setDescription('');
//       } catch (error) {
//         console.error('Failed to create documentation:', error);
//       }
//     } else {
//       console.error('Title and description are required.');
//     }
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <button className="px-4 py-2 rounded-xl border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
//           Create Documentation
//         </button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Create Documentation</DialogTitle>
//           <DialogDescription>
//             Fill in the details for the new documentation. Click save when you are done.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="title" className="text-right">
//               Title
//             </Label>
//             <Input
//               id="title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Enter title"
//               className="col-span-3"
//             />
//           </div>
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="description" className="text-right">
//               Description
//             </Label>
//             <Input
//               id="description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Enter description"
//               className="col-span-3"
//             />
//           </div>
//         </div>
//         <DialogFooter>
//           <button
//             className="px-4 py-2 rounded-xl border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
//             onClick={handleSave}
//           >
//             Save
//           </button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
import React, { useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSession } from 'next-auth/react';

interface CreateDocumentationDialogProps {
  addProject: (project: { title: string; description: string; link: string }) => void;
}

export function CreateDocumentationDialog({ addProject }: CreateDocumentationDialogProps) {
  const { data: session } = useSession();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = async () => {
    if (title.trim() && description.trim()) {
      const sanitizedTitle = title.trim().toLowerCase().replace(/\s+/g, '-');
      const link = `/doc/${sanitizedTitle}`;

      try {
        const email = session?.user?.email;
        if (!email) {
          throw new Error('User not authenticated');
        }

        const response = await axios.post('/api/projects/add', {
          title,
          description,
          link,
          email,
        });

        const newProject = response.data;
        addProject(newProject);
        setTitle('');
        setDescription('');
      } catch (error) {
        console.error('Failed to create documentation:', error);
      }
    } else {
      console.error('Title and description are required.');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-4 py-2 rounded-xl border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
          Create Documentation
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Documentation</DialogTitle>
          <DialogDescription>
            Fill in the details for the new documentation. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
