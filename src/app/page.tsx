import Image from "next/image";
import Portfolio from "./home";
import Script from "next/script";

export default function Home() {
  return (
    <>
      <div id="personaice-widget"></div>
      <Portfolio/>
      {/* <Script 
        src="http://localhost:3000/api/widget.js?api-key=pk_ucBfgb0Y1krY4itP7LGeThBhYOnPe195&theme=light" 
      /> */}
    </>
  );
}
