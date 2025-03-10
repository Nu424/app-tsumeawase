import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import Home from './components/apps/Home';
import NoiseApp from './components/apps/NoiseApp';
import App2 from './components/apps/App2';
import App3 from './components/apps/App3';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Content />}>
            <Route index element={<Home />} />
            <Route path="noise" element={<NoiseApp />} />
            <Route path="app2" element={<App2 />} />
            <Route path="app3" element={<App3 />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
