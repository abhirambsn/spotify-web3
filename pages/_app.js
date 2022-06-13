import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import { SpotifyProvider } from "../context/SpotifyContext";
import Player from "../components/Player";

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
      serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER}
      appId={process.env.NEXT_PUBLIC_MORALIS_APPID}
    >
      <SpotifyProvider>
        <Component {...pageProps} />
        <div className="bg-black">
          <footer>
            <Player />
          </footer>
        </div>
      </SpotifyProvider>
    </MoralisProvider>
  );
}

export default MyApp;
