import React, { useState } from 'react';
import * as Tone from 'tone';

const ASSET_SOUNDS = [
  { key: 'type', label: 'Type / Tap' },
  { key: 'delete', label: 'Delete' },
  { key: 'submit', label: 'Submit (Invalid)' },
  { key: 'gray', label: 'Tile: Gray' },
  { key: 'yellow', label: 'Tile: Yellow' },
  { key: 'green', label: 'Tile: Green (New)' },
  { key: 'greenKnown', label: 'Tile: Green (Known)' },
  { key: 'error', label: 'Row Error' },
  { key: 'win', label: 'Victory Chord', dur: 4000 },
  { key: 'lose', label: 'Defeat Chord', dur: 4000 },
  { key: 'xp', label: 'XP Tick' },
  { key: 'xpbar', label: 'XP Bar Hit' },
  { key: 'timer10', label: 'Timer 10s' },
  { key: 'timer3', label: 'Timer 3s' },
  { key: 'timer0', label: 'Timer 0s' },
  { key: 'roundInfo', label: 'Round Info Pop' },
  { key: 'hintWhoosh', label: 'Hint Fly' },
  { key: 'hintReveal', label: 'Hint Reveal' },
  { key: 'bombDrop', label: 'Bomb Drop' },
  { key: 'bombExplode', label: 'Bomb Explode', dur: 2000 }
];

// ═══════════════════════════════════════════════════════════
// WAV Encoder — PCM 16-bit, mono or stereo
// ═══════════════════════════════════════════════════════════
function encodeWAV(samples: Float32Array, sampleRate: number, numChannels = 1): Blob {
  const bytesPerSample = 2; // 16-bit
  const blockAlign = numChannels * bytesPerSample;
  const dataLength = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, 'WAVE');

  // fmt chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);           // chunk size
  view.setUint16(20, 1, true);            // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);           // bits per sample

  // data chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  // Write PCM samples (clamp to [-1, 1] → Int16)
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

// ═══════════════════════════════════════════════════════════
// Silence Trimmer — finds first/last non-silent sample
// ═══════════════════════════════════════════════════════════
function trimSilence(buffer: AudioBuffer, threshold = 0.005, paddingSamples = 200): Float32Array {
  // Mix down to mono
  const length = buffer.length;
  const mono = new Float32Array(length);
  const numChannels = buffer.numberOfChannels;
  
  for (let ch = 0; ch < numChannels; ch++) {
    const channelData = buffer.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      mono[i] += channelData[i] / numChannels;
    }
  }

  // Find first non-silent sample
  let start = 0;
  for (let i = 0; i < length; i++) {
    if (Math.abs(mono[i]) > threshold) {
      start = Math.max(0, i - paddingSamples);
      break;
    }
  }

  // Find last non-silent sample
  let end = length - 1;
  for (let i = length - 1; i >= 0; i--) {
    if (Math.abs(mono[i]) > threshold) {
      end = Math.min(length - 1, i + paddingSamples);
      break;
    }
  }

  // If the whole thing is silent, return a tiny buffer
  if (start >= end) {
    return new Float32Array(100);
  }

  return mono.slice(start, end + 1);
}

// ═══════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════
export const AudioAssetExporter = ({ 
    themeName, 
    playSFX, 
    onClose 
}: { 
    themeName: string, 
    playSFX: (key: any) => void, 
    onClose: () => void 
}) => {
    const [recordingKey, setRecordingKey] = useState<string | null>(null);
    const [status, setStatus] = useState('');

    const downloadSound = async (key: string, customDur?: number) => {
        if (recordingKey) return;
        setRecordingKey(key);
        setStatus('Recording...');

        try {
            await Tone.start();
            
            // Connect recorder to master destination
            const recorder = new Tone.Recorder();
            Tone.Destination.connect(recorder);
            
            recorder.start();
            
            // Play the sfx
            playSFX(key);
            
            // Wait for the sound's full tail/decay
            const recordDuration = customDur || 2500;
            await new Promise(resolve => setTimeout(resolve, recordDuration));
            
            // Stop recording — returns a Blob (webm/opus)
            setStatus('Processing...');
            const recording = await recorder.stop();
            
            // Cleanup routing
            Tone.Destination.disconnect(recorder);
            recorder.dispose();
            
            // Decode the blob into an AudioBuffer
            const arrayBuffer = await recording.arrayBuffer();
            const audioCtx = new AudioContext();
            const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            
            // Trim silence from both ends
            setStatus('Trimming...');
            const trimmed = trimSilence(audioBuffer, 0.003, 100);
            
            // Encode as WAV
            const wavBlob = encodeWAV(trimmed, audioBuffer.sampleRate, 1);
            
            // Cleanup
            audioCtx.close();
            
            // Trigger download
            const url = URL.createObjectURL(wavBlob);
            const anchor = document.createElement("a");
            anchor.download = `${themeName}_${key}.wav`;
            anchor.href = url;
            anchor.click();
            
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            setStatus('');
            
        } catch (e) {
            console.error("Recording failed", e);
            setStatus('Error!');
            setTimeout(() => setStatus(''), 2000);
        }
        
        setRecordingKey(null);
    };

    // Download ALL sounds sequentially
    const downloadAll = async () => {
        for (const s of ASSET_SOUNDS) {
            await downloadSound(s.key, s.dur);
            // Small gap between downloads to avoid browser throttling
            await new Promise(r => setTimeout(r, 500));
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[500px] max-h-[85vh] flex flex-col overflow-hidden">
                <div className="flex-none p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <div>
                        <h2 className="font-black text-[20px] text-gray-900 leading-tight">Audio Exporter</h2>
                        <p className="text-gray-500 font-bold text-[12px] uppercase">Theme: <span className="text-blue-500">{themeName}</span></p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={downloadAll} 
                            disabled={recordingKey !== null}
                            className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-[11px] font-bold hover:bg-emerald-600 active:scale-95 disabled:opacity-50"
                        >
                            ↓ ALL
                        </button>
                        <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold text-gray-600">✕</button>
                    </div>
                </div>
                
                {status && (
                    <div className="px-4 py-2 bg-blue-50 text-blue-700 text-[12px] font-bold text-center animate-pulse">
                        {status}
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {ASSET_SOUNDS.map(s => (
                        <div key={s.key} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-100">
                            <span className="font-bold text-gray-700 text-[14px]">{s.label}</span>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => playSFX(s.key)}
                                    disabled={recordingKey !== null}
                                    className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-[12px] font-bold hover:bg-gray-300 active:scale-95 disabled:opacity-50"
                                >
                                    ▶ PLAY
                                </button>
                                <button 
                                    onClick={() => downloadSound(s.key, s.dur)}
                                    disabled={recordingKey !== null}
                                    className={`px-3 py-1.5 rounded-lg text-[12px] font-bold text-white transition-all active:scale-95 disabled:opacity-50 min-w-[70px] ${recordingKey === s.key ? 'bg-red-500 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'}`}
                                >
                                    {recordingKey === s.key ? 'REC...' : '↓ .WAV'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className="p-3 bg-blue-50 text-blue-800 text-[11px] font-medium text-center border-t border-blue-100">
                    Ses kaydedilir → sessizlik otomatik kesilir → temiz WAV olarak indirilir. Başında/sonunda boşluk kalmaz.
                </div>
            </div>
        </div>
    );
}
