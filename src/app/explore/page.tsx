"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Cardgrid } from "@/components/explore-card";
import SidebarLayout from "@/components/sidebar-layout";

export default function Explore() {
  const [projects, setProjects] = useState<{ title: string; description: string; link: string; username: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/api/explore");
        setProjects(response.data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCardClick = (project: { title: string; description: string; link: string; username: string }) => {
    // Handle the card click here, e.g., navigate to the project link or open a dialog
    console.log("Project clicked:", project);
  };

  return (
    <SidebarLayout>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <Cardgrid items={projects} onCardClick={handleCardClick} />
      )}
    </SidebarLayout>
  );
}
