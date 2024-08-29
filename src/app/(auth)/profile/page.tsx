"use client";

import { usePathname, useSearchParams } from 'next/navigation';
import SidebarLayout from "@/components/sidebar-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from 'react';
import confetti from "canvas-confetti";
import { Cardgrid } from '@/components/card';

const Profile: React.FC = () => {
  const pathname = usePathname();
  const [profileId, setProfileId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [projects, setProjects] = useState<{ title: string; description: string; link: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = pathname.split('/')[2];
    if (id) {
      setProfileId(id);
    }
  }, [pathname]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleClick = () => {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 20, zIndex: 0 };
    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const handleButtonClick = () => {
    if (!isFollowing) {
      handleClick();
    }
    handleFollowClick();
  };
  
  const handleFollowClick = () => {
    setIsFollowing(prev => !prev);
  };

  const handleCardClick = (project: { title: string; description: string; link: string }) => {
    console.log("Project clicked:", project);
  };

  return (
    <SidebarLayout>
      <div className="p-4 ">
        <h1 className="text-4xl font-bold">Profile</h1>
        <hr className="mt-4 mb-4" />
        <div className="p-8 flex justify-center items-center">
          <div className="ml-4 flex flex-col justify-center items-center">
            <Avatar>
              <div className='h-52 w-52 flex justify-center items-center'>
                <AvatarImage src='https://github.com/shadcn.png' />
              </div>
              <AvatarFallback>{profileId}</AvatarFallback>
            </Avatar>
            <p className="p-4 text-lg font-medium">user.name</p>
            <p className='p-4 italic text-white/70'>bio</p>
            <p className='text-center w-72'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Ut suscipit, risus eu fringilla tincidunt, felis nulla facilisis metus, nec maximus mi.</p>
          </div>
        </div>
        <div>
          <h2 className=' text-xl font-bold px-4 pt-12 '>Created Documentations</h2>
          <hr className=" opacity-50 " />
        </div>
        <div>
          {loading ? (
            <p>Loading projects...</p>
          ) : error ? (
            <p>Error fetching projects: {error}</p>
          ) : (
            <Cardgrid projects={projects} onCardClick={handleCardClick} />
          )}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Profile;
