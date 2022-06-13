import React, { useCallback, useContext, useEffect } from "react";
import { SpotifyContext } from "../context/SpotifyContext";
import { IoIosClose } from "react-icons/io";
import Link from "next/link";
import { MoonLoader } from "react-spinners";

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

const BuyModal = () => {
  const {
    openModal,
    setOpenModal,
    buyTokens,
    tokenAmount,
    setTokenAmount,
    amountDue,
    setAmountDue,
    polygonScanLink,
    isLoading,
    setIsLoading,
    setPolygonScanLink,
  } = useContext(SpotifyContext);

  const calculatePrice = useCallback(() => {
    let price = parseFloat(parseFloat(tokenAmount) * 0.001);
    price = price.toFixed(4);
    setAmountDue(price);
  }, [setAmountDue, tokenAmount]);

  useEffect(() => {
    calculatePrice();
  }, [calculatePrice]);

  return (
    <div>
      {openModal &&
        (!isLoading ? (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className="flex items-center justify-between">
                <p className={styles.label}>Buy Spotify Coins</p>
                <p
                  className={styles.closeModalButton}
                  onClick={() => {
                    setOpenModal(false);
                    setTokenAmount("");
                    setAmountDue("");
                    setPolygonScanLink("");
                  }}
                >
                  <IoIosClose size={48} />
                </p>
              </div>
              <div className="mb-5 flex items-center flex-col mt-5">
                <div className={styles.title}>Buy Spotify Coins :)</div>
                <div className={styles.content}>
                  Enter No of Coins to buy.
                </div>

                <input
                  type="text"
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                  className={styles.input}
                  placeholder="Enter Amount"
                />
                <p className="flex items-center justify-center text-center text-3xl">
                  Amount to Pay: {""}
                  {tokenAmount && tokenAmount > 0
                    ? amountDue + " MATIC"
                    : "0 MATIC"}
                </p>
                <button
                  className={styles.button}
                  onClick={() => {
                    setIsLoading(true);
                    buyTokens();
                  }}
                >
                  Buy Coins
                </button>
                {polygonScanLink && (
                  <>
                    <div className={styles.success}>
                      Transaction Sucessful! Check out your receipt for your
                      transaction below!
                    </div>
                    <Link
                      href={`${polygonScanLink}`}
                      className={styles.polygonscan}
                    >
                      <a className={styles.polygonscan} target="_blank">
                        Transaction Receipt
                      </a>
                    </Link>
                  </>
                )}
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

export default BuyModal;
