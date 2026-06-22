"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TIME_UPDATE_MS = 200;

export function useAudioPlayback(audioSrc?: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const lastTickRef = useRef(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => {
      setDuration(audio.duration || 0);
      setReady(true);
    };

    const onTimeUpdate = () => {
      const now = performance.now();
      if (now - lastTickRef.current < TIME_UPDATE_MS) return;
      lastTickRef.current = now;
      setCurrentTime(audio.currentTime);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audioSrc]);

  const seekTo = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio || !audioSrc) return;
    audio.currentTime = Math.max(0, seconds);
    setCurrentTime(audio.currentTime);
  }, [audioSrc]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !audioSrc) return;
    if (audio.paused) {
      await audio.play();
    } else {
      audio.pause();
    }
  }, [audioSrc]);

  return {
    audioRef,
    audioSrc,
    currentTime,
    duration,
    isPlaying,
    ready,
    seekTo,
    togglePlay,
  };
}
