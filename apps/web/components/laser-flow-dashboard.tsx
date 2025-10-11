"use client";

import LaserFlow from "./LaserFlow";
import { useRef } from "react";
import { ProductDemoVideoPlayer } from "./product-demo";

// NOTE: You can also adjust the variables in the shader for super detailed customization

// Basic Usage
{
  /* <div style={{ height: "500px", position: "relative", overflow: "hidden" }}>
  <LaserFlow />
</div>; */
}

// Image Example Interactive Reveal Effect
export default function LaserFlowDashboard() {
  const revealImgRef = useRef(null);

  return (
    <div
      id="demo"
      style={{
        height: "1400px",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#060010",
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const el = revealImgRef.current;
        if (el) {
          (el as HTMLElement).style.setProperty("--mx", `${x}px`);
          (el as HTMLElement).style.setProperty(
            "--my",
            `${y + rect.height * 0.5}px`,
          );
        }
      }}
      onMouseLeave={() => {
        const el = revealImgRef.current;
        if (el) {
          (el as HTMLElement).style.setProperty("--mx", "-9999px");
          (el as HTMLElement).style.setProperty("--my", "-9999px");
        }
      }}
    >
      <LaserFlow
        horizontalBeamOffset={0.1}
        verticalBeamOffset={0.0}
        color="#cf9eff"
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "85%",
          maxWidth: "1200px",
          height: "auto",
          aspectRatio: "16/9",
          zIndex: 6,
        }}
        className="mx-auto border border-[#6C6C6C] p-2 md:p-4 bg-gradient-to-br from-[#222222] to-[#1a1a1a] rounded-[30px] shadow-2xl"
      >
        <ProductDemoVideoPlayer />
      </div>

      <h1 className="text-4xl md:text-7xl font-semibold absolute top-20 md:top-32 left-4 md:left-12 lg:left-20 text-white z-10 max-w-xl">
        Watch how <br />
        <span className="text-5xl md:text-8xl lg:text-[6rem] font-bold mt-1 leading-none bg-gradient-to-r from-[#cf9eff] to-[#8b5cf6] bg-clip-text text-transparent">
          Tweakleaf works !
        </span>
      </h1>

      {/* <img
        ref={revealImgRef}
        src="/dashboard.png"  
        alt="Reveal effect"
        style={{
          position: "absolute",
          width: "100%",
          top: "-50%",
          zIndex: 5,
          mixBlendMode: "lighten",
          opacity: 0.3,
          pointerEvents: "none",
          "--mx": "-9999px",
          "--my": "-9999px",
          WebkitMaskImage:
            "radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)",
          maskImage:
            "radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }}
      /> */}
    </div>
  );
}
