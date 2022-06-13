import { useRouter } from "next/router";
import { createContext, useState, useEffect, useCallback } from "react";
import { useMoralis, useMoralisQuery, useNewMoralisObject } from "react-moralis";
import { spotifyCoinAbi, spotifyCoinAddress } from "../lib/constants";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { set } from "lodash";

export const SpotifyContext = createContext();

export const SpotifyProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const [songs, setSongData] = useState([]);
  const [uip, setUip] = useState("");

  const [currentAccount, setCurrentAccount] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [amountDue, setAmountDue] = useState("");
  const [polygonScanLink, setPolygonScanLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState("");
  const [ownedMusic, setOwnedMusic] = useState([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState({});
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(false);
  const [volume, setVolume] = useState(false);
  const [timestamp, setTimestamp] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)

  const {save: saveMusic} = useNewMoralisObject("Music")

  const shuffle = () => {
    if (!isShuffle || !ownedMusic) return
    const owm = ownedMusic[0]
    const randomIdx = Math.floor(Math.random() * owm.length)
    playOnSelect(owm[randomIdx])
  }

  const pause = () => {
    setIsPaused(true);
    document.querySelector("#audio-element").pause();
  };

  const play = () => {
    document.querySelector("#audio-element").play();
    setIsPaused(false);
  };

  const playOnSelect = (song) => {
    try {
      document.querySelector("#audio-element").src = song?.url;
      document.querySelector("#audio-element").play();
      setCurrentSong(song);
      setIsPlaying(true);
      setIsPaused(false);
    } catch (err) {
      console.error(err);
    }
  };

  const msToMin = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return seconds == "60"
      ? minutes + 1 + ":00"
      : minutes + ":" + (parseFloat(seconds) < 10 ? "0" : "") + seconds;
  };

  const updateProgress = (e) => {
    const _progress = e.target.currentTime / e.target.duration;
    setProgress(_progress.toFixed(2) * 100);
    setTimestamp(msToMin(e.target.currentTime * 1000))
  };

  const setRepeat = () => {
    document.querySelector('#audio-element').loop = !isRepeat
    setIsRepeat(!isRepeat)
  }

  const playNext = () => {
    if (!ownedMusic) {
      setIsPlaying(false)
      setIsPaused(true)
      return
    }

    if (isShuffle) {
      shuffle()
      return
    }

    const owm = ownedMusic[0]
    const idx = owm.findIndex(val => val.id === currentAccount.id)
    if (owm.length === idx + 1) {
      playOnSelect(owm[0])
      return
    }
    playOnSelect(owm[idx+1])
  }

  const playPrevious = () => {
    if (!ownedMusic) {
      setIsPlaying(false)
      setIsPaused(true)
      return
    }

    if (isShuffle) {
      shuffle()
      return
    }

    const owm = ownedMusic[0]

    const idx = owm.findIndex(val => val.id === currentSong.id)
    if (idx === 0) {
        playOnSelect(owm[owm.length-1])
        return
    }
    playOnSelect(owm[idx-1])
  }

  const updateVolume = (e) => {
    try {
      setVolume(e.target.value);
      document.querySelector("#audio-element").volume = e.target.value;
    } catch (err) {
      console.error(err);
    }
  };

  const onProgressChange = (e) => {
    const _progress = e.target.value / 100;
    document.querySelector("#audio-element").currentTime =
      _progress * document.querySelector("#audio-element").duration;
  };

  const onVolumeChange = (e) => {
    let _volume = e.target.value/100;
    if (isNaN(_volume)) {
      _volume = 0.5
    }
    console.log(_volume)
    document.querySelector("#audio-element").volume = parseFloat(_volume.toString());
  };

  const [openModal, setOpenModal] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const router = useRouter();
  const {
    authenticate,
    isAuthenticated,
    enableWeb3,
    Moralis,
    user,
    isWeb3Enabled,
  } = useMoralis();

  const {
    data: songData,
    error: songDataError,
    isLoading: songDataLoading,
  } = useMoralisQuery("Music");

  const {
    data: userData,
    error: userDataError,
    isLoading: userDataLoading,
  } = useMoralisQuery("_User");

  const getBalance = useCallback(async () => {
    try {
      if (!isAuthenticated || !currentAccount) return;
      const options = {
        contractAddress: spotifyCoinAddress,
        functionName: "balanceOf",
        abi: spotifyCoinAbi,
        params: {
          account: currentAccount,
        },
      };

      if (isWeb3Enabled) {
        const response = await Moralis.executeFunction(options);
        setBalance(response.toString());
      }
    } catch (err) {
      console.error(err);
    }
  }, [currentAccount, Moralis, isAuthenticated, isWeb3Enabled]);

  const buySong = async (price, song, id) => {
    const notification = toast.loading("Processing Purchase...");
    try {
      if (!isAuthenticated) {
        toast.dismiss(notification);
        return;
      }
      if (!balance || balance <= 0) {
        toast.error("Insufficient Funds", { id: notification });
        return;
      }

      const oEth = ethers.BigNumber.from('1000000000000000000')
      const oAmt = ethers.BigNumber.from(price)
      const amt = oAmt.mul(oEth)
      const options = {
        type: "erc20",
        amount: amt,
        receiver: spotifyCoinAddress,
        contractAddress: spotifyCoinAddress,
      };

      let transaction = await Moralis.transfer(options);
      const reciept = await transaction.wait();

      if (reciept) {
        const res = userData[0].add("ownedMusic", {
          ...song,
          id,
          purchaseDate: Date.now(),
          polygonscanLink: `https://mumbai.polygonscan.io/tx/${reciept.transactionHash}`,
        });

        await res.save().then(async () => {
          toast.success("Music Purchase Successful", {
            id: notification,
          });

          await getBalance();
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Error Occured`, { id: notification });
    }
  };

  const listenToUpdates = async () => {
    let query = new Moralis.Query("EthTransactions");
    let subscription = await query.subscribe();
    subscription.on("update", async (object) => {});
  };

  const buyTokens = async () => {
    if (!isAuthenticated) {
      await authenticate();
    }

    const amount = ethers.BigNumber.from(tokenAmount);
    const price = ethers.BigNumber.from("1000000000000000");
    const calcPrice = amount.mul(price);

    let options = {
      contractAddress: spotifyCoinAddress,
      functionName: "mint",
      abi: spotifyCoinAbi,
      msgValue: calcPrice,
      params: {
        amount,
      },
    };

    const transaction = await Moralis.executeFunction(options);
    const receipt = await transaction.wait(4);
    setIsLoading(false);
    console.log(receipt);
    setPolygonScanLink(
      `https://mumbai.polygonscan.com/tx/${receipt.transactionHash}`
    );
    await getBalance();
  };

  useEffect(() => {
    (async () => {
      if (isAuthenticated) {
        await getBalance();
        const currentName = await user?.get("name");
        setUsername(currentName);
        const account = await user?.get("ethAddress");
        setCurrentAccount(account);
      }
    })();
  }, [isAuthenticated, user, username, currentAccount, getBalance]);

  const setNewUsername = () => {
    if (user) {
      if (uip) {
        user.set("name", uip);
        user.save();
        setUsername(uip);
        alert(`Username Set to ${uip}`);
        setUip("");
      } else {
        alert("Empty Username not Allowed");
      }
    } else {
      alert("No user found");
    }
  };

  useEffect(() => {
    const getSongs = async () => {
      try {
        await enableWeb3();
        setSongData(songData);
      } catch (err) {
        console.error(err);
      }
    };
    const getOwnedSongs = async () => {
      try {
        console.log(userData);
        if (userData[0]) {
          setOwnedMusic((prevItems) => [
            ...prevItems,
            userData[0].attributes.ownedMusic,
          ]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    (async () => {
      if (isWeb3Enabled) {
        await getSongs();
        await getOwnedSongs();
      }
    })();
  }, [isWeb3Enabled, songData, enableWeb3, songDataLoading, userData]);

  const logoutUser = () => {
    Moralis.User.logOut();
    setCurrentAccount('')
    setCurrentSong({})
    setIsPaused(true)
    setIsPlaying(false)
    setIsRepeat(false)
    setIsShuffle(false)
    setBalance("")
    router.reload();
  };

  const postMusic = (data) => {
    if (!data) return
    saveMusic(data, {
      onSuccess: async (msc) => {
        toast.success('Music Uploaded :)')
        setIsLoading(false)
        router.reload()
      },
      onerror: (error) => {
        toast.error(`Error Occured ${error.message}`)
        setIsLoading(false)
      }
    })
    
  }

  return (
    <SpotifyContext.Provider
      value={{
        isAuthenticated,
        username,
        setUsername,
        setNewUsername,
        uip,
        setUip,
        logoutUser,
        songs,
        balance,
        getBalance,
        setTokenAmount,
        tokenAmount,
        amountDue,
        setAmountDue,
        isLoading,
        buyTokens,
        setIsLoading,
        setPolygonScanLink,
        isWeb3Enabled,
        polygonScanLink,
        currentAccount,
        openModal,
        setOpenModal,
        buySong,
        ownedMusic,
        isPlaying,
        setIsPlaying,
        currentAccount,
        setCurrentAccount,
        isPaused,
        setIsPaused,
        playOnSelect,
        updateProgress,
        onProgressChange,
        onVolumeChange,
        timestamp,
        updateVolume,
        volume,
        progress,
        currentSong,
        setCurrentSong,
        msToMin,
        play,
        pause,
        isUploadModalOpen,
        setIsUploadModalOpen,
        postMusic,
        playPrevious,
        playNext,
        isRepeat,
        setRepeat,
        isShuffle,
        setIsShuffle
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};
