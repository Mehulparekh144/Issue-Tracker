"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import { ScrollArea } from "../ui/scroll-area";

interface ImagesProps {
  name: string;
  id: string;
  key: string;
  url: string;
  issueId: string | null;
}

interface ImagesArrayProps {
  images: ImagesProps[];
}

function ImagesModal({ images }: ImagesArrayProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button variant={"secondary"} className="absolute bottom-1 right-1">
          See More
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen">
        <ScrollArea>
          {images.map((item) => (
            <div
              key={item.id}
              className="flex relative justify-between flex-col gap-4"
            >
              <Image
                src={item.url}
                alt={item.name}
                width={1114}
                height={604}
                objectFit="contain"
                placeholder="blur"
                blurDataURL="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                className="aspect-auto rounded-tr-md transition-opacity shadow-md opacity-0 duration-[2s]"
                onLoadingComplete={(image) =>
                  image.classList.remove("opacity-0")
                }
              />
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default ImagesModal;
