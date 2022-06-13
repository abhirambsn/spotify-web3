import React, { useContext } from "react";
import toast from "react-hot-toast";
import { FaSpotify, FaPlayCircle, FaCartPlus } from "react-icons/fa";
import { SpotifyContext } from "../context/SpotifyContext";

const Song = ({ songData, id, order, owned }) => {
  const msToSeconds = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return seconds == "60"
      ? minutes + 1 + ":00"
      : minutes + ":" + (parseFloat(seconds) < 10 ? "0" : "") + seconds;
  };

  const {buySong, playOnSelect, isAuthenticated} = useContext(SpotifyContext)


  const playSong = () => {
    if (owned) {
      // Play the Song
      playOnSelect(songData)
    } else {
      // Ask the user to buy it
      toast.error("Please Buy the Song to play");
    }
  };

  return (
    <div
      className="grid grid-cols-2 text-gray-300 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer"
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        {/*eslint-disable-next-line @next/next/no-img-element */}
        <img className="h-10 w-10" src={songData?.cover} alt="" />
        <div>
          <p className="w-36 lg:w-64 truncate text-white">{songData?.name}</p>
          <p className="w-40">{songData?.artist}</p>
        </div>
      </div>

      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="w-40 hidden md:inline">{songData?.album}</p>
        <p className="flex items-center space-x-2 justify-center mr-2">
          <p>{songData?.price}</p>
          <FaSpotify />
        </p>
        <p className="hidden lg:inline">{msToSeconds(songData?.duration_ms)}</p>
        {isAuthenticated && (owned ? (
          <>
            <FaPlayCircle onClick={playSong} size={30} />
          </>
        ) : (
          <>
            <FaCartPlus
              onClick={() => buySong(songData?.price, songData, id)}
              size={30}
              className="cursor-pointer text-green-500"
            />
          </>
        ))}
      </div>
    </div>
  );
};

export default Song;
