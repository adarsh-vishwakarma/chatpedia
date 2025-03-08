"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Expand, Loader2 } from "lucide-react";
import SimpleBar from "simplebar-react";
import { Document, Page } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import { toast } from "react-toastify";

const PdfFullscreen = ({ fileUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); 
  const { width, ref } = useResizeDetector();

  useEffect(() => {
    if (currentPage > numPages) {
      setCurrentPage(numPages); 
    }
  }, [currentPage, numPages]);

  const renderPages = () => {
    const pagesToRender = [];
    
    for (let i = currentPage; i < Math.min(currentPage + 10, numPages + 1); i++) {
      pagesToRender.push(
        <Page
          key={i}
          width={width ? width : 1}
          pageNumber={i}
        />
      );
    }
    return pagesToRender;
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button variant="ghost" className="gap-1.5">
          <Expand className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-9xl w-full">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)] mt-6">
          <div ref={ref}>
            {isLoading && (
              <div className="flex justify-center my-24">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}

            <Document
              file={fileUrl}
              onLoadError={() => {
                toast("An error occurred while loading the PDF. Please try again later.");
                setIsLoading(false); 
              }}
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
                setIsLoading(false);
              }}
              className="max-h-full"
            >
              {renderPages()}
            </Document>
          </div>
        </SimpleBar>

        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 10, 1))}
            disabled={currentPage === 1}
          >
            Previous 10 Pages
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 10, numPages))}
            disabled={currentPage + 10 > numPages}
          >
            Next 10 Pages
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullscreen;
