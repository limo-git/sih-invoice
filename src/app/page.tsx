// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Reveal } from '@/components/reveal';
// import Layout from '../components/layout';
// 
// import { CreateDocumentationDialog } from '@/components/createDialog';
// import { EditViewDialog } from '@/components/viewDialog';
// import { useSession } from "next-auth/react";

// const Home: React.FC = () => {
//   const { data: session, status } = useSession();
//   const [projects, setProjects] = useState<{ title: string; description: string; link: string }[]>([]);
//   const [selectedProject, setSelectedProject] = useState<{ title: string; description: string; link: string } | null>(null);
  
//   useEffect(() => {
//     const fetchProjects = async () => {
//       if (status === "authenticated" && session?.user?._id) {
//         try {
//           const res = await axios.get(`/api/projects`, {
//             headers: {
//               'user-id': session.user._id,
//             },
//           });
//           setProjects(res.data); 
//         } catch (error) {
//           console.error("Failed to fetch projects:", error);
//         }
//       }
//     };

//     fetchProjects();
//   }, [session, status]);

//   const addProject = async (project: { title: string; description: string; link: string }) => {
//     if (session?.user?._id) {
//       try {
//         const res = await axios.post("/api/projects/add", { ...project, userId: session.user._id });
//         setProjects((prevProjects) => [...prevProjects, res.data]);
//       } catch (error) {
//         console.error("Failed to add project:", error);
//       }
//     }
//   };

//   const handleCardClick = (project: { title: string; description: string; link: string }) => {
//     setSelectedProject(project);
//   };

//   const handleCloseDialog = () => {
//     setSelectedProject(null);
//   };

//   const handleEdit = () => {
//     console.log("Edit project:", selectedProject);
//     handleCloseDialog();
//   };

//   const handleView = () => {
//     console.log("View project:", selectedProject);
//     handleCloseDialog();
//   };

//   return (
//     <div>
//       <Layout>
//         <div className="flex mt-4 justify-between gap-[16rem] pb-12">
//           <h1 className="text-4xl font-bold">Welcome to your dashboard!</h1>
//           <div>
//             <CreateDocumentationDialog addProject={addProject} />
//           </div>
//         </div>
//         <Reveal />
//         <Cardgrid projects={projects} onCardClick={handleCardClick} />
//       </Layout>
//       {selectedProject && (
//         <EditViewDialog
//           project={selectedProject}
//           onClose={handleCloseDialog}
//           onEdit={handleEdit}
//           onView={handleView}
//         />
//       )}
//     </div>
//   );
// };

// export default Home;
"use client"
import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Dashboard from './dashboard/page';

const TestSessionComponent: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <div>
        <p>Not signed in</p>
        <button onClick={() => signIn()}>Sign In</button>
      </div>
    );
  }

  return (
    <div>
      <Dashboard/>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

export default TestSessionComponent;

