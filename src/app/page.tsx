"use client";
import Main from "@/components/home/Main";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function Home() {
  const { theme } = useTheme();
  return (
    <div className="relative w-full inset-0 top-0 min-h-screen px-8 md:px-24 lg:px-32">
      <Main />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-80 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 "
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#f9fdc5] to-[#2dab5d] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        ></div>
      </div>
      <div className="max-w-6xl mx-auto px-2 lg:px-8">
        <div className="mt-16 lg:mt-24 flow-root">
          <div className="-m-2 lg:-m-4 rounded-xl bg-gray-900/5 p-1 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl lg:p-4">
            <Image
              src={`${
                theme === "dark"
                  ? "/dashboard_dark.png"
                  : "/dashboard_light.png"
              } `}
              alt="dashboard.png"
              width={1920}
              height={897}
              placeholder="blur"
              blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
              className="rounded-md p-2  ring-1 ring-gray-500/10 shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
