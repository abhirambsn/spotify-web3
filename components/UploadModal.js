import React, { useCallback, useContext, useEffect, useState } from "react";
import { SpotifyContext } from "../context/SpotifyContext";
import { IoIosClose } from "react-icons/io";
import Link from "next/link";
import { MoonLoader } from "react-spinners";
import cloudinary from '@cloudinary/react'

const styles = {
  modal: `w-full h-full bg-gray-800/90 z-10 fixed top-0 left-0 flex items-center justify-center`,
  modalContent: `bg-gray-900 text-white rounded-lg p-3 w-max w-full md:w-1/2`,
  input: `w-full lg:w-[50%] h-[50px] p-2 border rounded-lg mb-5 border-gray-600/50 outline-none bg-gray-800 text-white focus:outline-none`,
  button: `mt-5 flex items-center justify-center bg-green-500 p-2 px-5 rounded-lg text-white hover:opacity-50`,
  closeModalButton: `hover:text-red-300 text-gray-600 cursor-pointer`,
  loaderContainer: `w-full h-[500px] flex items-center justify-center`,
  title: `text-3xl font-bold flex flex-1 items-center mt-[20px] justify-center mb-[40px]`,
  content: `flex w-full mb-[30px] text-xl justify-center`,
  polygonscan: `w-full h-full flex items-center justify-center text-green-500 text-2xl mt-[20px] font-bold cursor-pointer`,
  success: `w-full h-full flex items-center justify-center text-xl mt-[20px] font-bolder`,
  loader: `w-full h-full flex items-center justify-center`,
};

const UploadModal = () => {
    const [title, setTitle] = useState('')
    const [artist, setArtist] = useState('')
    const [cover, setCover] = useState('')
    const [album, setAlbum] = useState('')
    const [url, setUrl] = useState('')
    const [price, setPrice] = useState(0)
    const [duration, setDuration] = useState(0)

    const [audioUploaded, setIsAudioUploaded] = useState(false)
    const [audioFilename, setAudioFilename] = useState('')
    const [coverUploaded, setIsCoverUploaded] = useState(false)
    const [coverFilename, setCoverFilename] = useState('')

  const {
    isUploadModalOpen,
    setIsUploadModalOpen,
    isLoading,
    setIsLoading,
    postMusic
  } = useContext(SpotifyContext);

  const checkResultAudio = (result) => {
    if (result?.event === 'success') {
        console.log(result?.info)
        setUrl(result?.info?.secure_url)
        setDuration(result?.info?.duration * 1000)
        setAudioFilename(result?.info?.filename)
        setIsAudioUploaded(true)
    }
  }

  const checkResultCover = (result) => {
    if (result?.event === 'success') {
        setCover(result?.info?.secure_url)
        setCoverFilename(result?.info?.filename)
        setIsCoverUploaded(true)
    }
  }

  return (
    <div>
      {isUploadModalOpen &&
        (!isLoading ? (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className="flex items-center justify-between">
                <p className={styles.label}>Upload Music to Service</p>
                <p
                  className={styles.closeModalButton}
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    
                  }}
                >
                  <IoIosClose size={48} />
                </p>
              </div>
              <div className="mb-5 flex items-center flex-col mt-5">
                <div className={styles.title}>Upload Music :)</div>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={styles.input}
                  placeholder="Enter Title"
                />
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className={styles.input}
                  placeholder="Enter Artist Name"
                />
                <input
                  type="text"
                  value={album}
                  onChange={(e) => setAlbum(e.target.value)}
                  className={styles.input}
                  placeholder="Enter Album Name"
                />
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={styles.input}
                  placeholder="Enter Price in Spotify Coins"
                />

                <div className="flex items-center space-x-4 justify-between">
                <button
                  className={styles.button}
                  onClick={() => {
                    let wd1 =window.cloudinary.createUploadWidget({
                        cloudName: 'dm0muijpa',
                        uploadPreset: 'spotifyweb3_music',
                        sources: ['local']
                    }, (err, result) => {checkResultAudio(result)})
                    wd1.open()
                  }}
                >
                  {audioUploaded ? `${audioFilename}` : "Upload Audio"}
                </button>
                <button
                  className={styles.button}
                  onClick={() => {
                    let wd2 = window.cloudinary.createUploadWidget({
                        cloudName: 'dm0muijpa',
                        uploadPreset: 'spotifyweb3_cover',
                        sources: ['local']
                    }, (err, result) => {checkResultCover(result)})
                    wd2.open()

                  }}
                >
                  {coverUploaded ? `${coverFilename}` : "Upload Cover"}
                </button>
                </div>
                
                <button
                  className={styles.button}
                  onClick={() => {
                    setIsLoading(true);
                    postMusic({name:title, artist, album, url, cover, price: parseFloat(price), duration_ms: duration})
                  }}
                >
                  Upload Music
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.loaderContainer}>
                <MoonLoader color="#22c55e" size={80} />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default UploadModal;
