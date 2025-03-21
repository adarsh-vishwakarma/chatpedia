import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import Dropzone from "react-dropzone";
import { Cloud, File, Loader2, Plus } from "lucide-react";
import { Progress } from "./ui/progress";
import { useUploadThing } from "@/lib/uploadthing";

const UploadDropzone = ({ setIsOpen, isUploading, setIsUploading, uploadProgress, setUploadProgress }) => {
  const { startUpload } = useUploadThing("pdfUpload");

  const startSimulatedProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 95) {
          clearInterval(interval);
          return prevProgress;
        }
        return prevProgress + 5;
      });
    }, 500);
    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      accept=".pdf"
      onDrop={async (acceptedFiles) => {
        console.log(acceptedFiles);
        setIsUploading(true);

        const progressInterval = startSimulatedProgress();
        const res = await startUpload(acceptedFiles);
        const [fileResponse] = res;
        console.log(fileResponse);
        clearInterval(progressInterval);
        setUploadProgress(100);

        if (acceptedFiles.length > 0) {
          setFileName(acceptedFiles[0].name);
        }

        if (fileResponse) {
          setTimeout(() => {
            setIsOpen(false); // ✅ Close the dialog after upload
          }, 1500);
        }
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-gray-300 rounded-lg"
        >
          <div className="flex items-center justify-center h-full w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-zinc-500">PDF (up to 4MB)</p>
              </div>

              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <File className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="px-3 py-2 h-full text-sm truncate">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress value={uploadProgress} className="h-1 w-full bg-zinc-200" />
                  {uploadProgress === 100 ? (
                    <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Redirecting...
                    </div>
                  ) : null}
                </div>
              ) : null}

              <input {...getInputProps()} />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

const UploadBtn = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDialogOpenChange = (open) => {
    // Prevent dialog from closing while uploading
    if (!isUploading) {
      setIsOpen(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button className="bg-orange-500 hover:bg-orange-700 hover:cursor-pointer"> <Plus className="h-8 w-8" /></Button>
      </DialogTrigger>
      <DialogContent onPointerDown={(e) => e.stopPropagation()}>
        <UploadDropzone
          setIsOpen={setIsOpen}
          isUploading={isUploading}
          setIsUploading={setIsUploading}
          uploadProgress={uploadProgress}
          setUploadProgress={setUploadProgress}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UploadBtn;
