import React, { useRef } from 'react';

// 音源の定義
const baseUrl = import.meta.env.BASE_URL;
const SOUNDS = [
  { id: 'airhorn', label: 'エアホーン', file: baseUrl + 'sounds/airhorn.mp3', icon: '📢' },
  { id: 'beep', label: 'ビープ音', file: baseUrl + 'sounds/beep.mp3', icon: '🔔' },
  { id: 'bell', label: 'ベル', file: baseUrl + 'sounds/bell.mp3', icon: '🛎️' },
];

const AirHorn: React.FC = () => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  const playSound = (soundId: string) => {
    const audio = audioRefs.current[soundId];
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  };

  const setAudioRef = (soundId: string, el: HTMLAudioElement | null) => {
    audioRefs.current[soundId] = el;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">エアホーン</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {SOUNDS.map(sound => (
          <div key={sound.id} className="relative">
            <button
              onClick={() => playSound(sound.id)}
              className="w-full aspect-square rounded-xl flex flex-col items-center justify-center p-4 transition-all transform hover:scale-105 bg-white shadow-lg hover:shadow-xl active:scale-95 active:bg-gray-100"
            >
              <span className="text-4xl mb-2">{sound.icon}</span>
              <span className="text-lg font-medium">{sound.label}</span>
            </button>
            <audio
              ref={(el) => setAudioRef(sound.id, el)}
              src={sound.file}
              preload="auto"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AirHorn; 