import React, { useContext, useEffect } from "react";
import { FaPlus, FaSpotify } from "react-icons/fa";
import { SpotifyContext } from "../context/SpotifyContext";
import { ethers } from "ethers";

const Balance = () => {
  const { balance, getBalance, setOpenModal } = useContext(SpotifyContext);
  useEffect(() => {
    (async () => {
      await getBalance();
    })();
  }, [getBalance]);

  const format = (balance) => {
    const eth = ethers.BigNumber.from(balance)
    const oEth = ethers.BigNumber.from('1000000000000000000')
    return eth.div(oEth).toString()
  }

  return (
    <div className="flex items-center bg-black space-x-3 rounded-full p-1 px-4">
      <h2>{!!balance ? format(balance) : '0'}</h2>
      <FaSpotify className="h-5 w-5" />
      <FaPlus
        className="h-4 w-4 hover:cursor-pointer"
        onClick={() => {
          setOpenModal(true);
        }}
      />
    </div>
  );
};

export default Balance;
