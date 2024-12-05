import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Pause, Play, RotateCwIcon, VolumeXIcon } from "lucide-react";
import { Slider } from "./Slider";
import { Button } from "./Button_";

interface AudioElementProps {
  autoplay?: boolean;
  src: string | MediaStream | null;
}

function Audio({ autoplay = false, src }: AudioElementProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isEnded, setIsEnded] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("timeupdate", handleTimeUpdate);
      audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioElement.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("timeupdate", handleTimeUpdate);
        audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audioElement.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  useEffect(() => {
    if (autoplay && audioRef.current) audioRef.current.play().catch(() => setIsError(true));
  }, [audioRef]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying && !isEnded) audioRef.current.pause();
    else if (isEnded) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => setIsError(true));
      setIsEnded(false);
    } else audioRef.current.play().catch(() => setIsError(true));

    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    if (audioRef.current) {
      audioRef.current.volume = volumeValue;
    }
  };

  const handleTimelineChange = (newTime: number[]) => {
    if (isEnded) setIsEnded(false);
    const timeValue = newTime[0];
    setCurrentTime(timeValue);
    if (audioRef.current) {
      audioRef.current.currentTime = timeValue;
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space") {
      e.preventDefault();
      togglePlay();
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setIsEnded(true);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (isError) {
    return (
      <div className="flex w-56 h-16 justify-center select-none items-center rounded-[6px] bg-gradient-to-br from-secondary/50 via-secondary/45 to-secondary/30 ">
        <VolumeXIcon className="h-5 w-5 mr-1" /> Couldn't load audio...
      </div>
    );
  }

  return (
    <div className="relative w-full bg-secondary/10 rounded-md p-4 pb-2">
      <audio ref={audioRef} src={typeof src === "string" ? src : undefined} onEnded={handleEnded} />
      <div className="flex flex-col gap-2">
        <Slider value={[currentTime]} min={0} max={duration} step={0.1} onValueChange={handleTimelineChange} className="w-full cursor-pointer" />
        <div className="flex gap-4 items-center justify-between">
          <div className="flex items-center gap-1">
            <Button className="h-7 w-7 hover:primary/20" variant="ghost" size="icon" onClick={togglePlay}>
              {isPlaying && !isEnded && <Pause className="h-4 w-4" />}
              {!isPlaying && !isEnded && <Play className="h-4 w-4" />}
              {isEnded && <RotateCwIcon className="h-4 w-4" />}
            </Button>
            <div className="flex items-center gap-2">
              <Button className="h-7 w-7 hover:primary/20" variant="ghost" size="icon" onClick={toggleMute}>
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Slider value={[volume]} min={0} max={1} step={0.01} onValueChange={handleVolumeChange} className="w-16" />
            </div>
          </div>
          <span className="text-sm select-none">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Audio;
