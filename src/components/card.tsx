import React from 'react';
import { HoverEffect } from "./ui/card-hover-effect";

interface CardgridProps {
  projects: Array<{ title: string; description: string; link: string }>;
  onCardClick: (project: { title: string; description: string; link: string }) => void;
}

export const Cardgrid: React.FC<CardgridProps> = ({ projects, onCardClick }) => {
  return (
    <div className="max-w-5xl mx-auto">
      <HoverEffect items={projects} onCardClick={onCardClick} />
    </div>
  );
};
