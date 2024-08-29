import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
interface SidebarProps {
  onFileSelect: (fileName: string) => void;
  onSave: () => void;
}

function Sidebar({ onFileSelect, onSave }: SidebarProps) {
  const [creatingNewFile, setCreatingNewFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [fileList, setFileList] = useState<string[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const storedFileList = localStorage.getItem('fileList');
    if (storedFileList) {
      setFileList(JSON.parse(storedFileList));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fileList', JSON.stringify(fileList));
  }, [fileList]);

  const handleCreateNew = () => {
    setCreatingNewFile(true);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewFileName(event.target.value);
  };

  const handleSaveFile = () => {
    if (newFileName.trim() !== '') {
      setFileList([...fileList, newFileName.trim()]);
      setNewFileName('');
      setCreatingNewFile(false);
      onFileSelect(newFileName.trim());
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSaveFile();
    }
  };

  const handleDeleteFile = (fileNameToDelete: string) => {
    setFileList(fileList.filter((fileName) => fileName !== fileNameToDelete));
  };

  return (
    <div className="h-full pb-4 w-[50%] overflow-y-auto bg-black text-white flex flex-col items-end">
      <ul className="space-y-2 font-medium flex flex-col w-[28%]">
        {creatingNewFile ? (
          <li className="flex items-center py-16">
            <input
              type="text"
              value={newFileName}
              onChange={handleNameChange}
              onKeyPress={handleKeyPress}
              className="p-2 w-[95%] border bg-black rounded-xl text-white border-grey opacity-70 outline-none"
              placeholder="Enter file name"
            />
          </li>
        ) : (
          <li className="flex flex-col justify-end w-[30%]">
            <button className="w-40 px-8 py-2 rounded-md border border-black rounded-xl bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
              <a href="#" onClick={handleCreateNew}>
                Add New
              </a>
            </button>
          </li>
        )}

        {fileList.map((fileName, index) => (
          <li key={index} className="relative group">
            <a
              href={`#${fileName}`}
              className="flex items-center p-2 rounded-lg text-white group"
              onClick={() => onFileSelect(fileName)}
            >
              <div className="flex">
                <span className="ms-3 font-normal">{fileName}</span>
                <button
                  onClick={() => handleDeleteFile(fileName)}
                  className="absolute right-2 p-1 text-white bg-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <div className="flex justify-center items-center">
                    <img
                      width="12"
                      height="12"
                      src="https://img.icons8.com/material-outlined/24/000000/filled-trash.png"
                      alt="filled-trash"
                    />
                  </div>
                </button>
              </div>
            </a>
          </li>
        ))}
      </ul>
      <div className="pt-4">
        <button
          className="w-40 px-8 py-2 rounded-md border border-black rounded-xl bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
          onClick={onSave}
        >
          Save
        </button>
      </div>
      <div className="pt-4">
      <Link href="/view/sample-2">
          <button className="w-40 px-8 py-2 rounded-md border border-black rounded-xl bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
            Preview
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;