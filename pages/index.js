import { useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
import Sidebar from "../components/Sidebar";
import Main from "../components/Main";
import BuyModal from "../components/BuyModal";
import UploadModal from "../components/UploadModal";
import { Toaster } from "react-hot-toast";
import AudioElement from "../components/AudioElement";
import { useContext } from "react";
import { SpotifyContext } from "../context/SpotifyContext";

export default function Home() {
  const {setIsPlaying} = useContext(SpotifyContext)
  useEffect(() => {
    setIsPlaying(false)
  }, [setIsPlaying])
  return (
    <div className="bg-gray-500">
      <Head>
        <title>Spotify Web3</title>
      </Head>
      <Script src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript" />
      <main className="flex">
        <BuyModal />
        <UploadModal />
        <Toaster />
        <Sidebar />
        <Main />
      </main>
      <AudioElement />
    </div>
  );
}
