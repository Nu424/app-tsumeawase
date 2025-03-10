import { useState } from 'react';
import { NoiseLevel } from '../NoiseLevel';

const NoiseApp: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [calibrationOffset, setCalibrationOffset] = useState(100);
  const [calibrationScale, setCalibrationScale] = useState(1);

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">騒音測定</h1>
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isActive
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isActive ? '停止' : '開始'}
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              このツールは周囲の音の大きさをリアルタイムで測定します。
              開始ボタンを押すと、マイクの使用許可を求められます。
            </p>
            <div className="mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  キャリブレーションオフセット
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    step="1"
                    value={calibrationOffset}
                    onChange={(e) => setCalibrationOffset(Number(e.target.value))}
                    className="mt-1 w-full"
                  />
                  <span className="ml-2 text-sm text-gray-700">{calibrationOffset}</span>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  キャリブレーションスケール
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="0.5"
                    max="5"
                    step="0.1"
                    value={calibrationScale}
                    onChange={(e) => setCalibrationScale(Number(e.target.value))}
                    className="mt-1 w-full"
                  />
                  <span className="ml-2 text-sm text-gray-700">{calibrationScale}</span>
                </div>
              </div>
            </div>
            <NoiseLevel isActive={isActive} calibrationOffset={calibrationOffset} calibrationScale={calibrationScale} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoiseApp; 