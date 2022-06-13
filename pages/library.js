import React, { useContext, useEffect, useState } from "react";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/outline";
import { shuffle } from "lodash";
import { SpotifyContext } from "../context/SpotifyContext";
import Balance from "../components/Balance";
import Head from "next/head";
import BuyModal from "../components/BuyModal";
import UploadModal from "../components/UploadModal";
import { Toaster } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Player from "../components/Player";
import Song from "../components/Song";
import AudioElement from "../components/AudioElement";
import { useRouter } from "next/router";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

const MyLibrary = () => {
  const [color, setColor] = useState("");
  const {
    username,
    setIsUploadModalOpen,
    isAuthenticated,
    setIsPlaying,
    ownedMusic: songData
  } = useContext(SpotifyContext);

  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, []);

  useEffect(() => {
    setIsPlaying(false)
  }, [setIsPlaying])

  return (
    <div className="bg-black text-white">
      <Head>
        <title>My Library</title>
      </Head>
      <main className="flex">
        <BuyModal />
        <UploadModal />
        <Toaster />
        <Sidebar />
        <div className="flex-grow text-white h-screen overflow-y-scroll scrollbar-hide">
          <header className="absolute flex space-x-4 top-5 right-8">
            <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  username
                    ? `https://avatars.dicebear.com/api/avataaars/${username}.svg`
                    : `https://avatars.dicebear.com/api/avataaars/Anonymous.svg`
                }
                alt="Profile Image"
                className="rounded-full w-10 h-10"
              />
              <h2>{username ? username : "Guest User"}</h2>
              <ChevronDownIcon className="h-5 w-5" />
            </div>

            {isAuthenticated && <Balance />}

            {isAuthenticated && (
              <div
                className="flex items-center bg-transparent border border-white space-x-3 hover:opacity-90 cursor-pointer rounded-full p-1 pr-2"
                onClick={() => {
                  setIsUploadModalOpen(true);
                  setIsPlaying(false);
                }}
              >
                <h2 className="mx-2">Upload Music</h2>
                <PlusIcon className="h-5 w-5" />
              </div>
            )}
          </header>

          <section
            className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8 w-full`}
          >
            {/* Header of All Songs */}
            <h2 className="text-5xl font-bolder">My Library</h2>
          </section>
          <div>
            <div className="px-8 flex flex-col space-y-1 pb-28 text-white">
              <hr />
              <div className="grid grid-cols-2 text-gray-300 py-2 px-5 rounded-lg">
                <div className="flex items-center space-x-4">
                  <p>#</p>
                  <p className="w-[25rem]">Title</p>
                </div>
              </div>
              <hr />
              {songData[0]?.map((track, i) => {
                return (
                  <Song
                    key={track.id}
                    songData={track}
                    id={track.id}
                    owned={true}
                    order={i}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <AudioElement />
    </div>
  );
};

export default MyLibrary;
