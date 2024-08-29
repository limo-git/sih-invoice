import React from 'react';
import Navbar from './navbar';
import Sidebar from './dash-side';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <div className='flex flex-col'>
        <div><Navbar/></div>
        <div className='flex'>
          <div><Sidebar/></div>
          <div className=" flex justify-center w-full ">
           <div className="p-4 mt-12">
             {children}
           </div>
         </div>
         </div>

      </div>
    </div>
    
  );
};

export default Layout;
