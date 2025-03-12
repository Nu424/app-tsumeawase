import React, { useEffect, useRef, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TooltipItem
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const FFTSpectrum: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [peakFrequency, setPeakFrequency] = useState<number>(0);
    const [peakMagnitude, setPeakMagnitude] = useState<number>(0);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const animationFrameRef = useRef<number>(0);

    // FFTサイズを4096に増やして周波数分解能を向上
    const maxFrequency = 2000;
    const fftSize = 4096;
    const sampleRate = 44100;
    const binSize = sampleRate / fftSize; // ≈ 10.77Hz
    const numDataPoints = Math.ceil(maxFrequency / binSize);
    // 周波数補正係数（実測値との誤差を補正）
    const frequencyCorrection = 1.11;
    const [spectrumData, setSpectrumData] = useState<number[]>(new Array(numDataPoints).fill(0));

    // 放物線補間を使用して、より正確な周波数のピークを見つける関数
    const findPreciseFrequency = (data: number[], peakIndex: number): number => {
        if (peakIndex <= 0 || peakIndex >= data.length - 1) {
            return peakIndex * binSize;
        }

        const alpha = data[peakIndex - 1];
        const beta = data[peakIndex];
        const gamma = data[peakIndex + 1];
        
        // 放物線補間を使用してピークの位置を推定
        const p = 0.5 * (alpha - gamma) / (alpha - 2*beta + gamma);
        const interpolatedIndex = peakIndex + p;

        return interpolatedIndex * binSize;
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 255,
                title: {
                    display: true,
                    text: 'Magnitude',
                    font: {
                        size: 14
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Frequency (Hz)',
                    font: {
                        size: 14
                    }
                },
                ticks: {
                    stepSize: 200,
                    callback: function (tickValue: number | string) {
                        const tickValueNum = Number(tickValue);
                        return `${Math.round(tickValueNum * binSize * frequencyCorrection)}Hz`;
                    }
                },
                min: 0,
                max: maxFrequency
            }
        },
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'FFT Spectrum Analyzer',
                font: {
                    size: 18
                }
            },
            tooltip: {
                enabled: true,
                mode: 'index' as const,
                intersect: false,
                callbacks: {
                    title: function(tooltipItems: TooltipItem<'line'>[]) {
                        const frequency = Number(tooltipItems[0].label);
                        return `周波数: ${Math.round(frequency)}Hz`;
                    },
                    label: function(context: TooltipItem<'line'>) {
                        return `強度: ${context.raw}`;
                    }
                }
            }
        }
    };

    const chartData = {
        labels: Array.from({ length: numDataPoints }, (_, i) => i * binSize * frequencyCorrection),
        datasets: [
            {
                data: spectrumData,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.1,
                borderWidth: 2,
                pointRadius: 0
            }
        ]
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioContextRef.current = new AudioContext();
            analyserRef.current = audioContextRef.current.createAnalyser();
            sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);

            analyserRef.current.fftSize = fftSize;
            sourceRef.current.connect(analyserRef.current);

            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopRecording = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        if (sourceRef.current) {
            sourceRef.current.disconnect();
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        setIsRecording(false);
    };

    const updateSpectrum = () => {
        if (!analyserRef.current || !isRecording) return;

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        const relevantData = Array.from(dataArray.slice(0, numDataPoints));
        setSpectrumData(relevantData);

        // 最大強度の周波数を計算（補間処理と補正係数を適用）
        const maxIndex = relevantData.indexOf(Math.max(...relevantData));
        const preciseFreq = findPreciseFrequency(relevantData, maxIndex);
        setPeakFrequency(Math.round(preciseFreq * frequencyCorrection));
        setPeakMagnitude(relevantData[maxIndex]);

        animationFrameRef.current = requestAnimationFrame(updateSpectrum);
    };

    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            stopRecording();
        };
    }, []);

    useEffect(() => {
        if (isRecording) {
            updateSpectrum();
        }
    }, [isRecording]);

    return (
        <div className="p-4">
            <div className="mb-4 flex items-center gap-4">
                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`px-4 py-2 rounded-lg ${isRecording
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                        } text-white`}
                >
                    {isRecording ? 'Stop' : 'Start'}
                </button>
                {isRecording && (
                    <div className="text-lg font-semibold">
                        最大周波数: {peakFrequency}Hz (強度: {peakMagnitude})
                    </div>
                )}
            </div>
            <div className="w-full h-[600px] bg-white rounded-lg shadow-lg p-4">
                <Line options={chartOptions} data={chartData} />
            </div>
        </div>
    );
};

export default FFTSpectrum; 