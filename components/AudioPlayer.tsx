"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { Button } from "./ui/button";

interface AudioPlayerProps {
  audioUrl?: string | null;
  text: string;
  lang?: string; // "vi" or "en"
}

export function AudioPlayer({ audioUrl, text, lang = "vi" }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      if (audioUrl && audioRef.current) {
        audioRef.current.pause();
      } else if (synthRef.current) {
        synthRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (audioUrl && audioRef.current) {
        audioRef.current.play();
      } else if (synthRef.current) {
        if (synthRef.current.paused) {
          synthRef.current.resume();
        } else {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = lang === "en" ? "en-US" : "vi-VN";
          
          // Lấy danh sách giọng đọc hiện có trên thiết bị
          const voices = synthRef.current.getVoices();
          const targetLang = lang === "en" ? "en" : "vi";
          const availableVoices = voices.filter(v => v.lang.includes(targetLang) || v.lang.includes(targetLang.toUpperCase()));
          
          if (availableVoices.length > 0) {
            // Cố gắng tìm giọng đọc xịn hơn (Google hoặc Premium/Enhanced của Apple)
            const preferredVoice = availableVoices.find(v => 
              v.name.includes('Google') || 
              v.name.includes('Premium') || 
              v.name.includes('Enhanced') ||
              v.name.includes('Linh') // Giọng chuẩn iOS
            ) || availableVoices[0];
            utterance.voice = preferredVoice;
          }

          // Điều chỉnh tốc độ đọc cho tự nhiên hơn một chút
          utterance.rate = 0.95;
          utterance.pitch = 1;

          utterance.onend = () => setIsPlaying(false);
          utteranceRef.current = utterance;
          synthRef.current.speak(utterance);
        }
      }
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-2xl p-2 pr-4 w-fit mb-6">
      <Button
        variant="default"
        size="icon"
        onClick={togglePlay}
        className="rounded-xl h-10 w-10 shrink-0 shadow-sm bg-primary hover:bg-primary/90"
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
      </Button>
      <div className="flex flex-col">
        <div className="text-sm font-semibold text-primary flex items-center gap-1.5">
          <Volume2 className="h-4 w-4" />
          {lang === "en" ? "Audio Guide" : "Nghe thuyết minh"}
        </div>
        <div className="text-xs text-slate-500 font-medium">
          {audioUrl ? (lang === "en" ? "Official recording" : "Bản thu âm chính thức") : (lang === "en" ? "AI Voice" : "Giọng đọc AI tự động")}
        </div>
      </div>
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          className="hidden"
        />
      )}
    </div>
  );
}
