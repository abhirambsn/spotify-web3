import React, { useContext, useState, useEffect } from "react";
import {
  BiShuffle,
  BiVolumeFull,
  BiSkipNext,
  BiSkipPrevious,
} from "react-icons/bi";
import { FiRepeat } from "react-icons/fi";
import { AiFillPauseCircle, AiFillPlayCircle } from "react-icons/ai";
import { SpotifyContext } from "../context/SpotifyContext";
import { shuffle } from "lodash";
import { IoIosClose } from "react-icons/io";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

const Player = () => {
  const {
    currentSong,
    isPlaying,
    volume,
    onVolumeChange,
    timestamp,
    progress,
    play,
    playNext,
    playPrevious,
    pause,
    isPaused,
    onProgressChange,
    msToMin,
    isRepeat,
    setRepeat,
    isShuffle,
    setIsShuffle,
    setCurrentSong,
    setIsPlaying,
    setIsPaused
  } = useContext(SpotifyContext);

  const [color, setColor] = useState("");
  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, []);

  const closePlay = () => {
    setCurrentSong({})
    setIsPlaying(false)
    setIsPaused(true)
    pause();
  }

  if (!isPlaying) return null;
  return (
    <div className={`fixed bottom-0 left-0 py-3 p-5 pr-10 w-full z-40 h-screen md:h-auto bg-gradient-to-b to-black ${color} md:from-black md:bg-black border-t border-t-gray-800 space-y-10 md:space-y-0 flex flex-col md:flex-row items-center justify-center md:w-screen md:justify-between text-white`}>
      <div className="flex flex-col md:flex-row justify-center items-center">
        <p className="fixed top-10 md:hidden text-3xl">Now Playing</p>
        <p onClick={closePlay} className="fixed top-9 left-2 md:hidden cursor-pointer">
          <IoIosClose size={40} />
        </p>
        <div className="hidden lg:inline w-20 h-20 mr-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentSong?.cover}
            height={200}
            width={200}
            alt="Song Cover"
            className="object-cover"
          />
        </div>
        <div className="hidden md:inline lg:hidden w-14 h-14 mr-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentSong?.cover}
            height={200}
            width={200}
            alt="Song Cover"
            className="object-cover"
          />
        </div>
        <div className="md:hidden w-36 h-20 mb-10 md:mb-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentSong?.cover}
            height={200}
            width={200}
            alt="Song Cover"
            className="object-cover"
          />
        </div>
        <div className="flex-col flex items-center mt-10 md:mt-0 md:items-start justify-center">
          <p className="text-2xl md:text-sm lg:text-lg">{currentSong?.name}</p>
          <p className="opacity-50 md:text-sm text-xl lg:text-lg">{currentSong?.artist}</p>
        </div>
      </div>
      <div>
        <div className="flex items-center justify-center mb-10 md:mb-0">
          <div onClick={() => setIsShuffle(!isShuffle)} className={`mr-5 cursor-pointer hover:opacity-100 ${isShuffle ? 'opacity-100' : 'opacity-50'}`}>
            <BiShuffle className={`${isShuffle ? 'text-green-500' : 'text-white'}`} size={24} />
          </div>
          <div
            onClick={playPrevious}
            className="mr-5 cursor-pointer hover:opacity-100 opacity-50"
          >
            <BiSkipPrevious size={24} />
          </div>
          {isPaused ? (
            <div
              onClick={play}
              className="mr-5 cursor-pointer hover:opacity-100 opacity-50"
            >
              <AiFillPlayCircle size={40} />
            </div>
          ) : (
            <div
              onClick={pause}
              className="mr-5 cursor-pointer hover:opacity-100 opacity-50"
            >
              <AiFillPauseCircle size={40} />
            </div>
          )}

          <div
            onClick={playNext}
            className="mr-5 cursor-pointer hover:opacity-100 opacity-50"
          >
            <BiSkipNext size={24} />
          </div>
          <div
              onClick={setRepeat}
              className={`mr-5 cursor-pointer hover:opacity-100 ${isRepeat ? 'opacity-100' : 'opacity-50'}`}
            >
              <FiRepeat className={`${isRepeat ? 'text-green-500' : 'text-white'}`} size={24} />
            </div>
        </div>
        <div className="items-center flex">
          <small>{timestamp}</small>
          <input
            type="range"
            value={progress}
            onChange={(e) => onProgressChange(e)}
            className="mx-3 hue-rotate-[89deg] invert-[68%] sepia-[21%] saturate-[1582%] brightness-[88%] contrast-[89%] h-1 w-[300px] lg:w-[500px]"
          />
          <small>{msToMin(currentSong?.duration_ms)}</small>
        </div>
      </div>
      <div>
        <div className="flex items-center">
          <BiVolumeFull />
          <input
            type="range"
            value={volume}
            min={0}
            max={100}
            step={0.1}
            className="mx-3 hue-rotate-[89deg] invert-[68%] sepia-[21%] saturate-[1582%] brightness-[88%] contrast-[89%] h-1"
            onChange={(e) => onVolumeChange(e)}
            id="volume-range"
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
