import React, { useState, useEffect } from 'react';

interface Position {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface Speed {
  mps: number;  // meters per second
  kmh: number;  // kilometers per hour
}

const SpeedMeter: React.FC = () => {
  const [speed, setSpeed] = useState<Speed>({ mps: 0, kmh: 0 });
  const [lastPosition, setLastPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string>('');
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  const calculateSpeed = (currentPosition: Position, previousPosition: Position): Speed => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = previousPosition.latitude * Math.PI / 180;
    const φ2 = currentPosition.latitude * Math.PI / 180;
    const Δφ = (currentPosition.latitude - previousPosition.latitude) * Math.PI / 180;
    const Δλ = (currentPosition.longitude - previousPosition.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // in meters

    const timeDiff = (currentPosition.timestamp - previousPosition.timestamp) / 1000; // in seconds
    const mps = distance / timeDiff;
    const kmh = mps * 3.6; // convert to km/h

    return { mps, kmh };
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsTracking(true);
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const currentPosition: Position = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: position.timestamp
        };

        if (lastPosition) {
          const newSpeed = calculateSpeed(currentPosition, lastPosition);
          setSpeed(newSpeed);
        }

        setLastPosition(currentPosition);
        setError('');
      },
      (err) => {
        setError(`Error: ${err.message}`);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
    setWatchId(id);
  };

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsTracking(false);
    setSpeed({ mps: 0, kmh: 0 });
    setLastPosition(null);
  };

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Speed Meter</h2>
      
      <div className="mb-6">
        <div className="text-center p-4 bg-gray-100 rounded-lg">
          <div className="text-4xl font-bold mb-2">
            {speed.kmh.toFixed(1)}
            <span className="text-2xl font-normal ml-2">km/h</span>
          </div>
          <div className="text-gray-600">
            ({speed.mps.toFixed(1)} m/s)
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        {!isTracking ? (
          <button
            onClick={startTracking}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Start Tracking
          </button>
        ) : (
          <button
            onClick={stopTracking}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Stop Tracking
          </button>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default SpeedMeter; 