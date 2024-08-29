import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <aside
      id="logo-sidebar"
      className="sticky top-0 left-0 z-40 w-48 h-screen pt-20 transition-transform -translate-x-full bg-black border-gray-200 sm:translate-x-0 dark:bg-black"
      aria-label="Sidebar"
    >
      <div className="h-full pl-56 w-[28rem]  overflow-y-auto bg-black">
        <ul className="space-y-2 font-medium">
          <li>
            <a
              href="dashboard"
              className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-white/10 hover:rounded-xl group"
            >
              <img width="24" height="24" src="https://img.icons8.com/badges/48/000000/dashboard.png" alt="dashboard"/>
              <span className="ms-3">Dashboard</span>
            </a>
          </li>
          <li>
            <a
              href="explore"
              className="flex items-center p-2 text-white rounded-lg hover:bg-white/10 hover:rounded-xl group"
            >
              <img width="24" height="24" src="https://img.icons8.com/ios-filled/50/FFFFFF/search--v1.png" alt="search--v1"/>
              <span className="flex-1 ms-3 whitespace-nowrap">Explore</span>
              
            </a>
          </li>
          <li>
            <a
              href="profile"
              className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-white/10 hover:rounded-xl group"
            >
              <img width="24" height="24" src="https://img.icons8.com/ios-glyphs/30/FFFFFF/user--v1.png" alt="user--v1"/>
              <span className="ms-3">Profile</span>
            </a>
          </li>
          <li>
            <a
              href="setting"
              className="flex items-center p-2 text-white rounded-lg hover:bg-white/10 hover:rounded-xl group"
            >
              <img width="24" height="24" src="https://img.icons8.com/ios/50/FFFFFF/settings--v1.png" alt="settings--v1"/>
              <span className="flex-1 ms-3 whitespace-nowrap">Settings</span>
              
            </a>
          </li>
          
          
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
