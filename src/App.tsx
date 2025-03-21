import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Content from './components/Content';
import Home from './components/apps/Home';
import NoiseApp from './components/apps/NoiseApp';
import ImageResizer from './components/apps/ImageResizer';
import AirHorn from './components/apps/AirHorn';
import SpeedMeter from './components/apps/SpeedMeter';
import FFTSpectrum from './components/apps/FFTSpectrum';
import App3 from './components/apps/App3';

const App: React.FC = () => {
  const baseUrl = import.meta.env.BASE_URL;
  return (
    <Router basename={baseUrl}>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Content />}>
            <Route index element={<Home />} />
            <Route path="noise" element={<NoiseApp />} />
            <Route path="fft-spectrum" element={<FFTSpectrum />} />
            <Route path="image-resizer" element={<ImageResizer />} />
            <Route path="airhorn" element={<AirHorn />} />
            <Route path="speedmeter" element={<SpeedMeter />} />
            <Route path="app3" element={<App3 />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
