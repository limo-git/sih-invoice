// "use client";

// import { usePathname } from 'next/navigation';
// import SidebarLayout from "@/components/sidebar-layout";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useEffect, useState } from 'react';
// import confetti from "canvas-confetti";
// import axios from 'axios';
// import { Cardgrid } from '@/components/card';
// import { useSession } from 'next-auth/react';

// const Profile: React.FC = () => {
//   const pathname = usePathname();
//   const { data: session } = useSession(); // Get the session data
//   const [profileId, setProfileId] = useState<string | null>(null);
//   const [isFollowing, setIsFollowing] = useState<boolean>(false);
//   const [projects, setProjects] = useState<{ title: string; description: string; link: string }[]>([]);

//   useEffect(() => {
//     const id = pathname.split('/')[2];
//     if (id) {
//       setProfileId(id);
//     }
//   }, [pathname]);

//   useEffect(() => {
//     const fetchProjects = async () => {
//       if (!session?.user?.email) return;

//       try {
//         const response = await axios.get('/api/projects', {
//           params: { email: session.user.email },
//         });
//         setProjects(response.data);
//       } catch (error) {
//         console.error('Failed to fetch projects:', error);
//       }
//     };

//     fetchProjects();
//   }, [session]);

//   const handleClick = () => {
//     const duration = 2 * 1000;
//     const animationEnd = Date.now() + duration;
//     const defaults = { startVelocity: 30, spread: 360, ticks: 20, zIndex: 0 };

//     const randomInRange = (min: number, max: number) =>
//       Math.random() * (max - min) + min;

//     const interval = window.setInterval(() => {
//       const timeLeft = animationEnd - Date.now();

//       if (timeLeft <= 0) {
//         return clearInterval(interval);
//       }

//       const particleCount = 50 * (timeLeft / duration);
//       confetti({
//         ...defaults,
//         particleCount,
//         origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
//       });
//       confetti({
//         ...defaults,
//         particleCount,
//         origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
//       });
//     }, 250);
//   };

//   const handleFollowClick = async () => {
//     if (!profileId || !session?.user?.email) {
//       console.error("Profile ID or user email is missing.");
//       return;
//     }

//     try {
//       const { data: followerResponse } = await axios.get(`/api/users/find-username`, {
//         params: { email: session.user.email },
//       });

//       const followerEmail = session?.user.email
//       const followingUsername = profileId;

//       if (isFollowing) {
//         await axios.delete("/api/users/unfollow", {
//           headers: { 'Content-Type': 'application/json' },
//           data: { followerEmail, followingUsername },
//         });
//       } else {
//         await axios.post("/api/users/follow", { followerEmail, followingUsername });
//         handleClick();
//       }
//       setIsFollowing(prev => !prev);
//     } catch (error: any) {
//       console.error("Failed to follow/unfollow user:", error.response?.data || error.message);
//     }
//   };

//   const handleCardClick = (project: { title: string; description: string; link: string }) => {
//     console.log("Project clicked:", project);
//   };

//   return (
//     <SidebarLayout>
//       <div className="p-4">
//         <h1 className="text-4xl font-bold">{profileId ? `${profileId}'s Profile` : 'Loading...'}</h1>
//         <hr className="mt-4 mb-4" />
//         <div className="p-8 flex justify-center items-center">
//           <div className="ml-4 flex flex-col justify-center items-center">
//             <Avatar>
//               <div className='h-52 w-52 flex justify-center items-center'>
//                 <AvatarImage src='https://github.com/shadcn.png' />
//               </div>
//               <AvatarFallback>{profileId}</AvatarFallback>
//             </Avatar>
//             <p className="p-4 text-lg font-medium">{profileId}</p>
//             <button
//               onClick={handleFollowClick}
//               className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
//             >
//               <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
//               <span className="inline-flex h-full w-24 cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
//                 {isFollowing ? 'Unfollow' : 'Follow'}
//               </span>
//             </button>
//             <p className='p-4 italic text-white/70'>bio</p>
//             <p className='text-center w-72'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Ut suscipit, risus eu fringilla tincidunt, felis nulla facilisis metus, nec maximus mi.</p>
//           </div>
//         </div>
//         <div>
//           <h2 className='text-xl font-bold px-4 pt-12'>Created Documentations</h2>
//           <hr className="opacity-50" />
//         </div>
//         <div><Cardgrid projects={projects} onCardClick={handleCardClick} /></div>
//       </div>
//     </SidebarLayout>
//   );
// };

// export default Profile;

"use client";

import { usePathname } from 'next/navigation';
import SidebarLayout from "@/components/sidebar-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from 'react';
import confetti from "canvas-confetti";
import axios from 'axios';
import { Cardgrid } from '@/components/card';
import { useSession } from 'next-auth/react';

export default function Profile() {
  const pathname = usePathname();
  const { data: session } = useSession(); 
  const [profileId, setProfileId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [projects, setProjects] = useState<{ title: string; description: string; link: string }[]>([]);

  useEffect(() => {
    const id = pathname.split('/')[2];
    if (id) {
      setProfileId(id);
    }
  }, [pathname]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!session?.user?.email) return;

      try {
        const response = await axios.get('/api/projects', {
          params: { email: session.user.email },
        });
        setProjects(response.data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    };

    fetchProjects();
  }, [session]);

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

   
  const handleFollowClick = async () => {
    try {
        // Retrieve the email of the user to follow
        const { data: followingResponse } = await axios.get('/api/users/find-email', {
            params: { profileId },
        });

        const followerEmail = session?.user?.email;

        if (!followerEmail || !followingResponse?.email) {
            console.error("Emails are missing.");
            return;
        }

        // Extract the email value from the response object
        const followingEmail = followingResponse.email;

        // Log the request data
        console.log("Request data:", {
            followerEmail,
            followingEmail,
        });

        const headers = { 'Content-Type': 'application/json' };

        if (isFollowing) {
            console.log("Sending DELETE request to /api/users/follow with data:", {
                followerEmail,
                followingEmail,
            });
            await axios.delete("/api/users/follow", {
                data: { followerEmail, followingEmail },
                headers, // Set the headers here
            });
        } else {
            console.log("Sending POST request to /api/users/follow with data:", {
                followerEmail,
                followingEmail,
            });
            await axios.post("/api/users/follow", { followerEmail, followingEmail }, { headers });
            handleClick();
        }

        setIsFollowing(prev => !prev);
    } catch (error: any) {
        console.error("Failed to follow/unfollow user:", error.response?.data || error.message);
    }
};

  const handleCardClick = (project: { title: string; description: string; link: string }) => {
    console.log("Project clicked:", project);
  };

  return (
    <SidebarLayout>
      <div className="p-4">
        <h1 className="text-4xl font-bold">{profileId ? `${profileId}'s Profile` : 'Loading...'}</h1>
        <hr className="mt-4 mb-4" />
        <div className="p-8 flex justify-center items-center">
          <div className="ml-4 flex flex-col justify-center items-center">
            <Avatar>
              <div className='h-52 w-52 flex justify-center items-center'>
                <AvatarImage src='https://github.com/shadcn.png' />
              </div>
              <AvatarFallback>{profileId}</AvatarFallback>
            </Avatar>
            <p className="p-4 text-lg font-medium">{profileId}</p>
            <button
              onClick={handleFollowClick}
              className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-24 cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                {isFollowing ? 'Unfollow' : 'Follow'}
              </span>
            </button>
            <p className='p-4 italic text-white/70'>bio</p>
            <p className='text-center w-72'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Ut suscipit, risus eu fringilla tincidunt, felis nulla facilisis metus, nec maximus mi.</p>
          </div>
        </div>
        <div>
          <h2 className='text-xl font-bold px-4 pt-12'>Created Documentations</h2>
          <hr className="opacity-50" />
        </div>
        <div><Cardgrid projects={projects} onCardClick={handleCardClick} /></div>
      </div>
    </SidebarLayout>
  );
};

