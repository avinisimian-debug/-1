"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type MediaPlaybackErrorCode =
  | "decode"
  | "network"
  | "unsupported"
  | "play_blocked"
  | "unknown";

export interface MediaPlayback {
  mediaRef: React.RefObject<HTMLMediaElement | null>;
  audioRef: React.RefObject<HTMLMediaElement | null>;
  mediaSrc?: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  ready: boolean;
  error: MediaPlaybackErrorCode | null;
  errorMessage: string | null;
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
  skipSilence: boolean;
  setSkipSilence: (value: boolean) => void;
  seekTo: (seconds: number) => void;
  togglePlay: () => Promise<void>;
  clearError: () => void;
}

/**
 * HTML5 media playback hook (audio or video).
 * Uses requestAnimationFrame while playing for smooth word-level highlighting.
 * @param remountKey — change when swapping video↔audio elements so listeners rebind
 */
export function useMediaPlayback(
  mediaSrc?: string,
  remountKey?: string,
): MediaPlayback {
  const mediaRef = useRef<HTMLMediaElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<MediaPlaybackErrorCode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [skipSilence, setSkipSilence] = useState(false);
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

  const clearError = useCallback(() => {
    setError(null);
    setErrorMessage(null);
  }, []);

  useEffect(() => {
    setReady(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setError(null);
    setErrorMessage(null);
  }, [mediaSrc, remountKey]);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media || !mediaSrc) return;

    const onLoaded = () => {
      setDuration(Number.isFinite(media.duration) ? media.duration : 0);
      setReady(true);
      clearError();
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

    const onError = () => {
      setReady(false);
      setIsPlaying(false);
      cancelTick();
      const mediaError = media.error;
      const code = mediaError?.code;
      if (code === mediaError?.MEDIA_ERR_SRC_NOT_SUPPORTED || code === 4) {
        setError("unsupported");
        setErrorMessage(
          "This recording uses a codec your browser cannot play (common with some Zoom/MOV exports). Trying audio-only fallback…",
        );
      } else if (code === mediaError?.MEDIA_ERR_NETWORK || code === 2) {
        setError("network");
        setErrorMessage("Network error while loading the recording.");
      } else if (code === mediaError?.MEDIA_ERR_DECODE || code === 3) {
        setError("decode");
        setErrorMessage(
          "Could not decode this video. Zoom HEVC/MOV files often fail in Chrome — we will try audio-only playback.",
        );
      } else {
        setError("unknown");
        setErrorMessage("Playback failed. Try exporting from Zoom as MP4 (H.264) or MP3.");
      }
    };

    media.addEventListener("loadedmetadata", onLoaded);
    media.addEventListener("durationchange", onLoaded);
    media.addEventListener("timeupdate", onTimeUpdate);
    media.addEventListener("play", onPlay);
    media.addEventListener("pause", onPause);
    media.addEventListener("ended", onEnded);
    media.addEventListener("seeked", onSeeked);
    media.addEventListener("error", onError);

    // Force reload when src / element remounts (video→audio fallback).
    try {
      media.load();
    } catch {
      /* ignore */
    }

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
      media.removeEventListener("error", onError);
    };
  }, [mediaSrc, remountKey, cancelTick, syncTime, clearError]);

  const seekTo = useCallback(
    (seconds: number) => {
      const media = mediaRef.current;
      if (!media || !mediaSrc) return;
      try {
        media.currentTime = Math.max(0, seconds);
        setCurrentTime(media.currentTime);
      } catch {
        /* ignore seek on unloaded media */
      }
    },
    [mediaSrc],
  );

  const setPlaybackRate = useCallback((rate: number) => {
    const media = mediaRef.current;
    const next = Math.min(2, Math.max(0.5, rate));
    setPlaybackRateState(next);
    if (media) media.playbackRate = next;
  }, []);

  useEffect(() => {
    const media = mediaRef.current;
    if (media) media.playbackRate = playbackRate;
  }, [mediaSrc, playbackRate]);

  const togglePlay = useCallback(async () => {
    const media = mediaRef.current;
    if (!media || !mediaSrc) return;
    if (media.paused) {
      try {
        await media.play();
      } catch (err) {
        setError("play_blocked");
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Playback was blocked by the browser. Click play again.",
        );
      }
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
    error,
    errorMessage,
    playbackRate,
    setPlaybackRate,
    skipSilence,
    setSkipSilence,
    seekTo,
    togglePlay,
    clearError,
  };
}

/** @deprecated Use useMediaPlayback */
export const useAudioPlayback = useMediaPlayback;
