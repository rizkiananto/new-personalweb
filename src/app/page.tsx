import Image from "next/image";
import Portfolio from "./home";
import Script from "next/script";

export default function Home() {
  return (
    <>
      <Script
        src="https://personaized.com/api/widget.js?api-key=pk_zaA1Sgr8hT6iGH0kAwjvtdSillFIcEDI" />
      <Portfolio />
    </>
  );
}
