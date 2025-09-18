"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";

export function ContainerScrollComponent() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold">
              Sneak Peek <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                of dashboard
              </span>
            </h1>
          </>
        }
      >
        <Image
          src={`/screenshot-png.png`}
          alt="hero"
          height={720}
          width={1000}
          className="mx-auto rounded-2xl object-cover h-full w-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
