"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * HTML5 media playback hook (audio or video).
 * Uses requestAnimationFrame while playing for smooth word-level highlighting.
 */
export function useMediaPlayback(mediaSrc?: string) {
  const mediaRef = useRef<HTMLMediaElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const rafRef = useRef(0);

  const cancelTick = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  const syncTime = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;
    setCurrentTime(media.currentTime);
  }, []);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const onLoaded = () => {
      setDuration(media.duration || 0);
      setReady(true);
      syncTime();
    };

    const onTimeUpdate = () => syncTime();

    const tick = () => {
      syncTime();
      if (!media.paused) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const onPlay = () => {
      setIsPlaying(true);
      cancelTick();
      rafRef.current = requestAnimationFrame(tick);
    };

    const onPause = () => {
      setIsPlaying(false);
      cancelTick();
      syncTime();
    };

    const onEnded = () => {
      setIsPlaying(false);
      cancelTick();
      syncTime();
    };

    const onSeeked = () => syncTime();

    media.addEventListener("loadedmetadata", onLoaded);
    media.addEventListener("durationchange", onLoaded);
    media.addEventListener("timeupdate", onTimeUpdate);
    media.addEventListener("play", onPlay);
    media.addEventListener("pause", onPause);
    media.addEventListener("ended", onEnded);
    media.addEventListener("seeked", onSeeked);

    if (media.readyState >= 1) {
      onLoaded();
    }

    return () => {
      cancelTick();
      media.removeEventListener("loadedmetadata", onLoaded);
      media.removeEventListener("durationchange", onLoaded);
      media.removeEventListener("timeupdate", onTimeUpdate);
      media.removeEventListener("play", onPlay);
      media.removeEventListener("pause", onPause);
      media.removeEventListener("ended", onEnded);
      media.removeEventListener("seeked", onSeeked);
    };
  }, [mediaSrc, cancelTick, syncTime]);

  const seekTo = useCallback(
    (seconds: number) => {
      const media = mediaRef.current;
      if (!media || !mediaSrc) return;
      media.currentTime = Math.max(0, seconds);
      setCurrentTime(media.currentTime);
    },
    [mediaSrc],
  );

  const togglePlay = useCallback(async () => {
    const media = mediaRef.current;
    if (!media || !mediaSrc) return;
    if (media.paused) {
      await media.play();
    } else {
      media.pause();
    }
  }, [mediaSrc]);

  return {
    mediaRef,
    audioRef: mediaRef,
    mediaSrc,
    currentTime,
    duration,
    isPlaying,
    ready,
    seekTo,
    togglePlay,
  };
}

/** @deprecated Use useMediaPlayback */
export const useAudioPlayback = useMediaPlayback;
