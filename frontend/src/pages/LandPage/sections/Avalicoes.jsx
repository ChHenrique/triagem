
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useEffect } from "react";

import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function Avaliacoes() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <h1 className=" text-white flex flex-row justify-center items-center text-5xl font-Sora-black h-24 w-full ">
        Porque escolher ?
      </h1>
      <div
        
        className="mt-14 grid-rows-1 items-center place-content-center place-items-center grid-cols-3 justify-center grid  gap-16 w-fit h-fit"
      ></div>{" "}
    </div>
  );
}
