"use client";
import { ChevronDown } from "lucide-react";
import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
// Set the workerSrc to a stable version (e.g., 2.10.377)
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
const PdfRender = ({ url }) => {
  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button >
            <ChevronDown className="h-4 w-4" />
          </Button>


          <div className='flex items-center gap-1.5'>
            <Input
              
              className={
                'w-12 h-8'
                
              }
             
            />
            <p className='text-zinc-700 text-sm space-x-1'>
              <span>/</span>
              <span>{}</span>
            </p>
          </div>

        </div>
      </div>

      <Document
              
              file={url}
              className='max-h-full'>
              

              <Page
               pageNumber={1}
              />
            </Document>
    </div>
  );
};

export default PdfRender;
