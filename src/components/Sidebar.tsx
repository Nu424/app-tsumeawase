import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const apps = [
    { id: 'noise', name: '騒音測定', icon: '🔊', path: '/noise' },
    { id: 'image-resizer', name: '画像リサイズ', icon: '🖼️', path: '/image-resizer' },
    { id: 'app3', icon: '🎮', path: '/app3' },
  ];

  return (
    <div className="fixed h-full w-16 bg-gray-800 flex flex-col items-center py-4 space-y-6">
      <Link
        to="/"
        className={`w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-gray-600 transition-colors ${
          location.pathname === '/' ? 'ring-2 ring-blue-500' : ''
        }`}
      >
        <span className="text-2xl">🏠</span>
      </Link>
      {apps.map((app) => (
        <Link
          key={app.id}
          to={app.path}
          className={`w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white hover:bg-gray-600 transition-colors ${
            location.pathname === app.path ? 'ring-2 ring-blue-500' : ''
          }`}
          title={app.name}
        >
          <span className="text-2xl">{app.icon}</span>
        </Link>
      ))}
    </div>
  );
};

export default Sidebar; 