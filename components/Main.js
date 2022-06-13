import React, { useContext, useEffect, useState } from "react";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/outline";
import { shuffle } from "lodash";
import { SpotifyContext } from "../context/SpotifyContext";
import Songs from "./Songs";
import Balance from "./Balance";
import { ConnectButton } from "web3uikit";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

function Main() {
  const [color, setColor] = useState("");
  const { username, setIsUploadModalOpen, isAuthenticated, setIsPlaying, logoutUser } =
    useContext(SpotifyContext);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, []);

  return (
    <div className="flex-grow text-white h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute flex space-x-4 top-5 right-8">
        <div onClick={() => logoutUser()} className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 text-sm lg:text-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              username
                ? `https://avatars.dicebear.com/api/avataaars/${username}.svg`
                : `https://avatars.dicebear.com/api/avataaars/Anonymous.svg`
            }
            alt="Profile Image"
            className="rounded-full w-7 h-7 md:w-10 md:h-10"
          />
          <h2>{username ? username : "Guest User"}</h2>
          <ChevronDownIcon className="h-5 w-5 hidden md:inline" />
        </div>

        {!isAuthenticated && (
          <div className="lg:hidden flex">
            <ConnectButton />
          </div>
        )}

        {isAuthenticated && <Balance />}

        {isAuthenticated && (
          <div className="flex items-center bg-transparent border border-white space-x-3 hover:opacity-90 cursor-pointer rounded-full p-1 pr-2 text-xs lg:text-lg" onClick={() => {setIsUploadModalOpen(true);setIsPlaying(false)}}>
            <h2 className="mx-2">Upload Music</h2>
            <PlusIcon className="h-5 w-5" />
          </div>
        )}
      </header>

      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8 w-full`}
      >
        {/* Header of All Songs */}
        <h2 className="text-5xl font-bolder">All Songs</h2>
      </section>
      <div>
        <Songs />
      </div>
    </div>
  );
}

export default Main;
