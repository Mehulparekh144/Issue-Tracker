import { Cloud, Minus } from "lucide-react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/button";

interface FileProps{
  name : string,
  type : string
}

function ScreenshotUpload() {
  const [selectedFiles , setSelectedFiles] = useState<Array<FileProps>>([])
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      accept: {
        "image/jpeg": [],
        "image/png": [],
        "image/jpg": [],
      },
      onDrop : (accepted) =>{
        setSelectedFiles([...selectedFiles , ...accepted])
      }
    });
    
  const handleDeleteFile = (file:FileProps) =>{
    setSelectedFiles(selectedFiles.filter((f) => f != file))
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className=" cursor-pointer border-2 border-dashed  py-4 mt-2 border-zinc-200 rounded-md dark:border-zinc-800 "
      >
        <div
          {...getInputProps}
          className="flex flex-col items-center justify-center"
        >
          <div>
            <Cloud className="h-10 w-10 text-zinc-700 dark:text-zinc-200" />
          </div>
          <div className="text-center">
            <h1 className="text-primary font-semibold">
              Click to upload or drag and drop
            </h1>
            <p className="text-muted-foreground text-xs">
              .jpg .jpeg .png accepted
            </p>
          </div>
        </div>
      </div>
      <div>
        {selectedFiles.length > 0 &&
          selectedFiles.map((item, index) => (
            <div
              key={index}
              className="w-full flex justify-between text-sm text-muted-foreground mt-2 gap-1"
            >
              <h1>{item.name}</h1>
              <Button
              type="button"
                variant={"destructive"}
                size={"icon"}
                onClick={() =>
                  handleDeleteFile(item)
                }
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ScreenshotUpload;
