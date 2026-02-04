
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Native Browser TTS Fallback
const speakNative = (text: string) => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.0;
    
    // Try to get voices (handling async loading in Chrome)
    const voices = window.speechSynthesis.getVoices();
    const vnVoice = voices.find(v => v.lang.includes('vi'));
    if (vnVoice) utterance.voice = vnVoice;

    window.speechSynthesis.speak(utterance);
  }
};

export const getRaoVerse = async (number: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Số ${number}. Hãy tạo 1 câu thơ rao lô tô vui nhộn, vần điệu (lục bát hoặc 4 chữ) dẫn dắt đến con số ${number}. Chỉ trả về nội dung câu thơ, không thêm gì khác.`,
      config: {
        systemInstruction: "Bạn là người gọi số Lô Tô chuyên nghiệp. Bạn biết những câu rao truyền thống và sáng tạo thêm những câu hài hước, hiện đại.",
        temperature: 0.8,
      },
    });
    return response.text?.trim() || `Con số tiếp theo, số ${number}!`;
  } catch (error: any) {
    // Handle Quota Limit (429) gracefully
    if (error.status === 429 || error.code === 429 || error.message?.includes('429')) {
       console.warn("Gemini Rao API quota exceeded. Using fallback text.");
    } else {
       console.error("Gemini Rao Error:", error);
    }
    return `Mời quý vị đón xem con số ${number}!`;
  }
};

/**
 * Decodes base64 string to Uint8Array
 */
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Decodes raw PCM data to AudioBuffer
 */
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

let audioContext: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;

export const speakText = async (text: string): Promise<void> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      // Instructions for clear number calling
      contents: [{ parts: [{ text: `Hô to con số này, giọng rõ ràng, dứt khoát: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data returned");

    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }

    if (currentSource) {
      try { currentSource.stop(); } catch(e) {}
    }

    const audioData = decodeBase64(base64Audio);
    const buffer = await decodeAudioData(audioData, audioContext, 24000, 1);
    
    currentSource = audioContext.createBufferSource();
    currentSource.buffer = buffer;
    currentSource.connect(audioContext.destination);
    currentSource.start();
  } catch (error: any) {
    // Handle Quota Limit (429) gracefully by falling back to native TTS
    if (error.status === 429 || error.code === 429 || error.message?.includes('429')) {
       console.warn("Gemini TTS API quota exceeded. Switching to native browser TTS.");
    } else {
       console.error("Gemini TTS Error:", error);
    }
    speakNative(text);
  }
};
