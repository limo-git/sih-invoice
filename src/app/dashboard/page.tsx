"use client"
import SidebarLayout from "@/components/sidebar-layout";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Reveal } from '@/components/reveal';
import Layout from '@/components/layout';
import { Cardgrid } from '@/components/card';
import { CreateDocumentationDialog } from '@/components/createDialog';
import { EditViewDialog } from '@/components/viewDialog';
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<{ title: string; description: string; link: string }[]>([]);
  const [selectedProject, setSelectedProject] = useState<{ title: string; description: string; link: string } | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          const res = await axios.get(`/api/projects`, {
            params: {
              email: session.user.email, 
            },
          });
          setProjects(res.data); 
        } catch (error) {
          console.error("Failed to fetch projects:", error);
        }
      }
    };

    fetchProjects();
  }, [session, status]);

  const addProject = async (project: { title: string; description: string; link: string }) => {
    if (session?.user?.email) {
      try {
        const response = await axios.post("/api/projects/add", {
          ...project,
          email: session.user.email,
        });
        setProjects((prevProjects) => [...prevProjects, response.data]);
      } catch (error) {
        console.error("Failed to add project:", error);
      }
    } else {
      console.error("User not authenticated.");
    }
  };

  const handleCardClick = (project: { title: string; description: string; link: string }) => {
    setSelectedProject(project);
  };

  const handleCloseDialog = () => {
    setSelectedProject(null);
  };

  const handleEdit = () => {
    console.log("Edit project:", selectedProject);
    handleCloseDialog();
  };

  const handleView = () => {
    console.log("View project:", selectedProject);
    handleCloseDialog();
  };

  const handleDelete = (title: string) => {
    setProjects((prevProjects) => prevProjects.filter(project => project.title !== title));
  };

  return (
    <SidebarLayout>
      <div className="flex mt-4 justify-between gap-[16rem] pb-12">
        <h1 className="text-4xl font-bold">Welcome to your dashboard!</h1>
        <div>
          <CreateDocumentationDialog addProject={addProject} />
        </div>
      </div>
      <Reveal />
      <Cardgrid projects={projects} onCardClick={handleCardClick} />
      {selectedProject && (
        <EditViewDialog
          project={selectedProject}
          onClose={handleCloseDialog}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
        />
      )}
    </SidebarLayout>
  );
}
