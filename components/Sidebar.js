import React, { useContext } from "react";
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  LogoutIcon,
} from "@heroicons/react/outline";

import { FaSpotify } from "react-icons/fa";
import { SpotifyContext } from "../context/SpotifyContext";
import { ConnectButton } from "web3uikit";
import { useRouter } from "next/router";

export default function Sidebar() {
  const {
    isAuthenticated,
    username,
    uip,
    setUip,
    logoutUser,
    setNewUsername,
  } = useContext(SpotifyContext);

  const router = useRouter()

  
  return (
      <div className="text-gray-300 p-5 w-64 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex">
        <div className="space-y-4">
          <button className="flex items-center justify-between space-x-4 text-white">
            <FaSpotify size={48} />
            <p className="text-white text-2xl hidden md:inline md:text-lg">
              Spotify<sub className="text-xs">Web3</sub>
            </p>
          </button>
          <hr className="border-t-[0.1px] border-gray-900" />
          <button className="flex items-center space-x-4 hover:text-white" onClick={() => router.replace('/')}>
            <HomeIcon className="h-6 w-6 text-blue-400" />
            <p className="text-lg">Home</p>
          </button>

          <button className="flex items-center space-x-4 hover:text-white">
            <SearchIcon className="h-6 w-6" />
            <p className="text-lg">Search</p>
          </button>

          <button className="flex items-center space-x-4 hover:text-white" onClick={() => router.push('/library')}>
            <LibraryIcon className="h-6 w-6 text-green-500" />
            <p className="text-lg">My Library</p>
          </button>
          <hr className="border-t-[0.1px] border-gray-900" />
          {isAuthenticated ? (
            <>
              <button
                className="flex items-center space-x-4 hover:text-white"
                onClick={() => logoutUser()}
              >
                <LogoutIcon className="h-6 w-6 text-red-600" />
                <p className="text-lg">Log Out</p>
              </button>
              {!username && (
                <div className="flex flex-col items-center text-white">
                  <input
                    type="text"
                    placeholder="New Username..."
                    value={uip}
                    className="bg-transparent border-white border-2 rounded-lg w-[80%] py-2 px-4 text-lg mt-[20px] placeholder:text-white focus:outline-none flex justify-center items-center text-white"
                    onChange={(e) => setUip(e.target.value)}
                  />
                  <button
                    className="text-lg font-bold flex flex-1 items-center mt-[20px] mb-[20px] text-white"
                    onClick={setNewUsername}
                  >
                    Set Nickname
                  </button>
                </div>
              )}
            </>
          ) : (
            <ConnectButton />
          )}
        </div>
      </div>
  );
}
