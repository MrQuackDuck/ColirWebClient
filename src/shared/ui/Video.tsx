import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Pause, Play, Maximize, Minimize, VideoOffIcon, RotateCwIcon } from "lucide-react";
import { Slider } from "./Slider";
import { Button } from "./Button_";

interface VideoElementProps {
  autoplay?: boolean;
  controls?: boolean;
  src: string | MediaStream | null;
}

function Video({ autoplay = false, controls = true, src }: VideoElementProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isEnded, setIsEnded] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("timeupdate", handleTimeUpdate);
      videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.addEventListener("keydown", handleKeyDown);
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("timeupdate", handleTimeUpdate);
        videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
        videoElement.removeEventListener("keydown", handleKeyDown);
      }
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isPlaying]);

  useEffect(() => {
    if (autoplay && videoRef.current) videoRef.current.play().catch(() => setIsError(true));
  }, [videoRef]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying && !isEnded) videoRef.current.pause();
    else if (isEnded) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => setIsError(true));
      setIsEnded(false);
    } else videoRef.current.play().catch(() => setIsError(true));

    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    if (videoRef.current) {
      videoRef.current.volume = volumeValue;
    }
  };

  const handleTimelineChange = (newTime: number[]) => {
    if (isEnded) setIsEnded(false);
    const timeValue = newTime[0];
    setCurrentTime(timeValue);
    if (videoRef.current) {
      videoRef.current.currentTime = timeValue;
    }
  };

  const toggleFullScreen = () => {
    if (videoContainerRef.current) {
      if (!document.fullscreenElement) {
        videoContainerRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  const handleDoubleClick = () => {
    togglePlay();
    toggleFullScreen();
  };

  const handleSingleClick = () => {
    togglePlay();
  };

  const handleClick = () => {
    handleSingleClick();
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
        <VideoOffIcon className="h-5 w-5 mr-1" /> Couldn't load video...
      </div>
    );
  }

  return (
    <div ref={videoContainerRef} className="relative w-full aspect-video bg-black" onMouseEnter={() => setShowControls(true)} onMouseLeave={() => setShowControls(false)}>
      <video
        ref={videoRef}
        src={typeof src === "string" ? src : undefined}
        autoPlay={autoplay}
        className="w-full h-full"
        onClickCapture={handleClick}
        onDoubleClickCapture={handleDoubleClick}
        onEnded={handleEnded}
        tabIndex={0}
      />
      {controls && (
        <div className={`absolute bg-background/50 flex flex-col gap-0.5 bottom-0 left-0 right-0 text-primary p-0.5 transition-opacity duration-200 ${showControls ? "opacity-100" : "opacity-0"}`}>
          <Slider value={[currentTime]} min={0} max={duration} step={0.1} onValueChange={handleTimelineChange} className="w-full cursor-pointer thumbDisabled" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button className="h-7 w-7 hover:primary/20" variant="ghost" size="icon" onClick={togglePlay}>
                {isPlaying && !isEnded && <Pause className="h-4 w-4" />}
                {!isPlaying && !isEnded && <Play className="h-4 w-4" />}
                {isEnded && <RotateCwIcon className="h-4 w-4" />}
              </Button>
              <div className="flex gap-0.5">
                <Button className="h-7 w-7 hover:primary/20" variant="ghost" size="icon" onMouseDown={toggleMute}>
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Slider value={[volume]} min={0} max={1} step={0.01} onValueChange={handleVolumeChange} className="w-24" />
              </div>
            </div>
            <div className="flex gap-1 items-center">
              <span className="text-sm select-none">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <Button className="h-8 w-8 hover:primary/20" variant="ghost" size="icon" onClick={toggleFullScreen}>
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}
      {
        // Show a line on the left side which will hide the controls when hovered
        isFullscreen && <div className="absolute left-0 top-0 h-full w-1.5" onDoubleClick={toggleFullScreen} onMouseEnter={() => setShowControls(false)} onMouseLeave={() => setShowControls(true)} />
      }
    </div>
  );
}

export default Video;
