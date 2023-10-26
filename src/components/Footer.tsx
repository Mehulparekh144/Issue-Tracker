import React from 'react'
import MaxWidthWrapper from './MaxWidthWrapper'
import { Code2, Github, Link2, Linkedin, LinkedinIcon, Mail } from 'lucide-react';
import Link from 'next/link';
import { Separator } from './ui/separator';


function Footer() {
  return (
    <div className="w-full dark:bg-zinc-950 bg-zinc-100 mt-24 h-30 text-muted-foreground">
      <MaxWidthWrapper className="py-12 flex justify-evenly">
        <div className="flex flex-col items-start justify-center gap-4">
          <h1 className="text-lg md:text-xl text-primary font-display">Protrackr.</h1>
          <Link
            href="https://github.com/Mehulparekh144/Issue-Tracker"
            target="_blank"
          >
            <Code2 />
          </Link>
        </div>
        <Separator orientation="vertical" className="w-2" />
        <div className="flex flex-col gap-2 items-start justify-center ">
          <h1 className="text-md md:text-lg font-display">By - Mehul Parekh</h1>
          <Link
            className="underline text-sm flex gap-2 items-center"
            href={"mailto:mehulparekh144@gmail.com"}
          >
            <Mail className="h-4 w-4" />
            Let&apos;s talk
          </Link>
          <Separator />
          <div className="flex gap-4 flex-wrap ">
            <Link href={"https://github.com/Mehulparekh144"} target="_blank">
              <Github />
            </Link>
            <Link href={"https://mehulparekh.vercel.app"} target="_blank">
              <Link2 />
            </Link>
            <Link
              href={"https://www.linkedin.com/in/mehul-parekh-a519a9196/"}
              target="_blank"
            >
              <LinkedinIcon />
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

export default Footer