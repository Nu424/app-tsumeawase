import { useState, useEffect, useRef } from 'react';

interface NoiseLevelProps {
  isActive: boolean;
  // キャリブレーション用のパラメータ（任意入力）
  calibrationOffset?: number; // デフォルトは 100
  calibrationScale?: number;  // デフォルトは 2
}

export const NoiseLevel: React.FC<NoiseLevelProps> = ({
  isActive,
  calibrationOffset = 100,
  calibrationScale = 2,
}) => {
  const [decibels, setDecibels] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isActive) {
      initializeAudio();
    } else {
      cleanup();
    }
    return () => cleanup();
  }, [isActive]);

  const initializeAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 2048;
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      startMeasuring();
    } catch (err) {
      setError('マイクへのアクセスが拒否されました。設定を確認してください。');
      console.error('Audio initialization error:', err);
    }
  };

  const cleanup = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setDecibels(null);
  };

  const startMeasuring = () => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = new Float32Array(analyser.frequencyBinCount);

    const measure = () => {
      if (!analyserRef.current) return;
      
      analyser.getFloatTimeDomainData(dataArray);
      
      // RMS (Root Mean Square) calculation
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i] * dataArray[i];
      }
      const rms = Math.sqrt(sum / dataArray.length);
      
      // 生の dB 値の計算（rms が 0 の場合は -Infinity となるので注意）
      let db = -Infinity;
      if (rms > 0) {
        db = 20 * Math.log10(rms);
      }
      
      /* 
         キャリブレーションの実施:
         calibrationOffset および calibrationScale を用いて、元の dB 値を調整します。
         調整後の値は [0, 100] の範囲にクランプされます。
      */
      const calibratedValue = (db + calibrationOffset) * calibrationScale;
      const normalizedDb = Math.max(0, Math.min(100, calibratedValue));
      
      setDecibels(Math.round(normalizedDb));
      
      requestAnimationFrame(measure);
    };
    
    requestAnimationFrame(measure);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">騒音レベル測定</h2>
      {error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : (
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">
            {decibels !== null ? `${decibels} dB` : '-- dB'}
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
              style={{ width: `${decibels ?? 0}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}; 