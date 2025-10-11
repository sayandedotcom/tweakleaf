"use client";

import LaserFlow from "./LaserFlow";
import { useRef } from "react";

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
      style={{
        height: "1200px",
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
          el.style.setProperty("--mx", `${x}px`);
          el.style.setProperty("--my", `${y + rect.height * 0.5}px`);
        }
      }}
      onMouseLeave={() => {
        const el = revealImgRef.current;
        if (el) {
          el.style.setProperty("--mx", "-9999px");
          el.style.setProperty("--my", "-9999px");
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
          width: "68%",
          height: "50%",
          backgroundColor: "#060010",
          borderRadius: "20px",
          border: "1px solid #ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "2rem",
          zIndex: 6,
        }}
        className="mx-auto w-full border-1 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl"
      >
        <img
          src={`/dashboard-new.png`}
          alt="dashboard"
          className="mx-auto rounded-2xl object-cover h-full w-full object-left-top"
          draggable={false}
        />
      </div>

      <h1 className="text-6xl font-semibold absolute top-40 left-30 text-white">
        Sneak Peek <br />
        <span className="text-6xl md:text-[6rem] font-bold mt-1 leading-none">
          of dashboard
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
