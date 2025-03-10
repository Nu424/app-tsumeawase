import React, { useState, useRef } from 'react';

interface ImageResizerProps {
  className?: string;
}

const ImageResizer: React.FC<ImageResizerProps> = ({ className }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resizeRatio, setResizeRatio] = useState<number>(100);
  const [customRatio, setCustomRatio] = useState<number>(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRatioSelect = (ratio: number) => {
    setResizeRatio(ratio);
    setCustomRatio(ratio);
  };

  const handleCustomRatioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (!isNaN(value) && value > 0 && value <= 100) {
      setCustomRatio(value);
      setResizeRatio(value);
    }
  };

  const handleResize = async () => {
    if (!selectedImage || !canvasRef.current) return;

    setIsProcessing(true);
    try {
      const img = new Image();
      img.src = previewUrl!;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const newWidth = (img.width * resizeRatio) / 100;
      const newHeight = (img.height * resizeRatio) / 100;

      canvas.width = newWidth;
      canvas.height = newHeight;

      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      const resizedImageUrl = canvas.toDataURL(selectedImage.type);
      const link = document.createElement('a');
      link.href = resizedImageUrl;
      link.download = `resized_${selectedImage.name}`;
      link.click();
    } catch (error) {
      console.error('Error resizing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-2xl font-bold mb-4">画像リサイズ</h2>
      
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            id="imageInput"
          />
          <label
            htmlFor="imageInput"
            className="cursor-pointer text-blue-500 hover:text-blue-600"
          >
            画像を選択
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-4 max-w-full max-h-64 mx-auto"
              />
            )}
          </label>
        </div>

        <div className="space-y-2">
          <p className="font-medium">リサイズ比率:</p>
          <div className="flex space-x-2">
            {[10, 25, 50, 75].map((ratio) => (
              <button
                key={ratio}
                onClick={() => handleRatioSelect(ratio)}
                className={`px-3 py-1 rounded ${
                  resizeRatio === ratio
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {ratio}%
              </button>
            ))}
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max="100"
                value={customRatio}
                onChange={handleCustomRatioChange}
                className="w-20 px-2 py-1 border rounded"
              />
              <span>%</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleResize}
          disabled={!selectedImage || isProcessing}
          className={`w-full py-2 rounded ${
            !selectedImage || isProcessing
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isProcessing ? '処理中...' : 'リサイズしてダウンロード'}
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageResizer; 