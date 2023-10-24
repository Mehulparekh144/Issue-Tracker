import { Cloud, Loader2, Minus } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { trpc } from "@/app/_trpc/client";
import { useUploadThing } from "@/lib/uploadThing";
import Image from "next/image";

interface FileProps {
  name: string;
  id: string;
  key: string;
  url: string;
}

interface ImageStateProps {
  selectedFiles: Array<FileProps>;
  setSelectedFiles: React.Dispatch<React.SetStateAction<Array<FileProps>>>;
}

function ScreenshotUpload({
  selectedFiles,
  setSelectedFiles,
}: ImageStateProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<string | null>("");
  const { startUpload } = useUploadThing("imageUploader");
  const { mutate: startPolling } = trpc.getTempFile.useMutation({
    onSuccess: (file) => {
      setSelectedFiles((prev) => [...prev, file]);
    },
    retry: true,
    retryDelay: 500,
  });

  const { mutate: deleteFileMutate } = trpc.removeTempFile.useMutation({
    onSuccess: (id) => {
      setSelectedFiles(selectedFiles.filter((f) => f.id != id));
    },
    onMutate: ({ id }) => {
      setIsDeleting(id);
    },
    onSettled: () => {
      setIsDeleting(null);
    },
    onError: () => {
      toast.error("Error while deleting file");
    },
  });
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      multiple: false,
      accept: {
        "image/jpeg": [],
        "image/png": [],
        "image/jpg": [],
      },
      onDrop: async (accepted) => {
        setIsLoading(true);
        const res = await startUpload(accepted);
        if (!res) {
          toast.error("File not uploaded. Internal Server error");
        }
        //@ts-ignore
        const [fileResponse] = res;
        const key = fileResponse?.key;
        const id = fileResponse?.id;
        if (!key) {
          toast.error("File not uploaded. Internal Server error");
        }
        setIsLoading(false);
        startPolling({ key });
      },
    });

  const handleDeleteFile = async (file: FileProps) => {
    deleteFileMutate({ id: file.id, key: file.key });
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className=" cursor-pointer border-2 border-dashed  py-4 mt-2 border-zinc-200 rounded-md dark:border-zinc-800 "
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          {isLoading ? (
            <>
              <div>
                <Loader2 className="h-10 w-10 animate-spin text-zinc-700 dark:text-zinc-200" />
              </div>
              <div className="text-center">
                <h1 className="text-primary font-semibold">Uploading....</h1>
              </div>
            </>
          ) : (
            <>
              <div>
                <Cloud className="h-10 w-10 text-zinc-700 dark:text-zinc-200" />
              </div>
              <div className="text-center">
                <h1 className="text-primary font-semibold">
                  Click to upload or drag and drop (4MB)
                </h1>
                <p className="text-muted-foreground text-xs">
                  .jpg .jpeg .png accepted
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col md:flex-row flex-wrap gap-3 items-center justify-center md:justify-start">
        {selectedFiles.length > 0 &&
          selectedFiles.map((item, index) => (
            <div
              key={item.id}
              className="w-max  relative flex flex-col text-sm text-muted-foreground mt-2 gap-1"
            >
              <Image
                src={item.url}
                alt={item.name}
                width={280}
                height={280}
                className="aspect-auto rounded-md shadow-md transition-opacity opacity-0 duration-[2s]"
                onLoadingComplete={(image) =>
                  image.classList.remove("opacity-0")
                }
              />
              <h1>{item.name}</h1>
              <div className="absolute -right-1 -top-1">
                <Button
                  className="rounded-full hover:bg-inherit"
                  type="button"
                  variant={"destructive"}
                  size={"icon"}
                  disabled={isDeleting === item.id}
                  onClick={() => handleDeleteFile(item)}
                >
                  {isDeleting === item.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Minus className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ScreenshotUpload;
