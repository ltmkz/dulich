"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, Loader2 } from "lucide-react";
import { Button } from "./ui/button";

interface AudioPlayerProps {
  text: string;
  audioUrl?: string | null; // Nếu có file audio sẵn thì dùng luôn
  lang?: string;
}

export function AudioPlayer({ text, audioUrl: staticAudioUrl, lang = "vi" }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const getAudioUrl = useCallback(async (): Promise<string | null> => {
    // Ưu tiên dùng file audio tĩnh nếu có sẵn
    if (staticAudioUrl) return staticAudioUrl;

    // Nếu đã generate rồi thì dùng lại
    if (generatedAudioUrl) return generatedAudioUrl;

    // Chỉ dùng VietTTS cho Tiếng Việt
    if (lang === "vi") {
      setIsLoading(true);
      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: text.slice(0, 500) }),
        });
        if (res.ok) {
          const { audioUrl } = await res.json();
          setGeneratedAudioUrl(audioUrl);
          return audioUrl;
        }
      } catch (e) {
        console.error("TTS error:", e);
      } finally {
        setIsLoading(false);
      }
    }
    return null;
  }, [staticAudioUrl, generatedAudioUrl, lang, text]);

  const togglePlay = async () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    const url = await getAudioUrl();
    if (url) {
      if (!audioRef.current) {
        audioRef.current = new Audio(url);
        audioRef.current.onended = () => setIsPlaying(false);
        audioRef.current.onpause = () => setIsPlaying(false);
      } else {
        audioRef.current.src = url;
      }
      await audioRef.current.play();
      setIsPlaying(true);
    } else {
      // Fallback về Web Speech API nếu VietTTS thất bại
      const synth = window.speechSynthesis;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 500));
      utterance.lang = lang === "en" ? "en-US" : "vi-VN";
      utterance.rate = 0.9;
      utterance.onend = () => setIsPlaying(false);
      synth.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-2xl p-2 pr-4 w-fit mb-6">
      <Button
        variant="default"
        size="icon"
        onClick={togglePlay}
        disabled={isLoading}
        className="rounded-xl h-10 w-10 shrink-0 shadow-sm bg-primary hover:bg-primary/90"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5 ml-0.5" />
        )}
      </Button>
      <div className="flex flex-col">
        <div className="text-sm font-semibold text-primary flex items-center gap-1.5">
          <Volume2 className="h-4 w-4" />
          {lang === "en" ? "Audio Guide" : "Nghe thuyết minh"}
        </div>
        <div className="text-xs text-slate-500 font-medium">
          {isLoading
            ? (lang === "en" ? "Generating audio..." : "Đang tạo âm thanh...")
            : staticAudioUrl
            ? (lang === "en" ? "Official recording" : "Bản thu âm chính thức")
            : lang === "vi"
            ? "VietTTS AI"
            : "AI Voice"}
        </div>
      </div>
    </div>
  );
}
