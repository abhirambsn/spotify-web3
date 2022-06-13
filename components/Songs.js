import React, { useContext } from "react";
import Song from "./Song";
import { SpotifyContext } from "../context/SpotifyContext";

const Songs = () => {
  const { songs: songData, ownedMusic } = useContext(SpotifyContext);

  const checkOwnership = (curSong) => {
    const owm = ownedMusic[0];
    if (!owm) return false;
    return owm.filter((i) => i.id === curSong.id)?.length > 0;
  };

  return (
    <div className="px-8 flex flex-col space-y-1 pb-28 text-white">
      <hr />
      <div className="grid grid-cols-2 text-gray-300 py-2 px-5 rounded-lg">
        <div className="flex items-center space-x-4">
          <p>#</p>
          <p className="w-[25rem]">Title</p>
        </div>
      </div>
      <hr />
      {songData.map((track, i) => {
        return (
          <Song
            key={track.id}
            songData={track.attributes}
            id={track.id}
            owned={checkOwnership(track)}
            order={i}
          />
        );
      })}
    </div>
  );
};

export default Songs;
