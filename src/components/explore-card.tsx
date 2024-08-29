import React from 'react';
import { HoverEffect } from "./ui/card-hover";

interface CardgridProps {
  items: { title: string; description: string; link: string; username: string }[]; // Ensure username is included
  onCardClick: (item: { title: string; description: string; link: string; username: string }) => void; // Ensure username is included
}

export const Cardgrid: React.FC<CardgridProps> = ({ items, onCardClick }) => {
  return (
    <div className="max-w-5xl mx-auto">
      <HoverEffect items={items} onCardClick={onCardClick} />
    </div>
  );
};
