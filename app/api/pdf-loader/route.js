import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { NextResponse } from "next/server";



const pdfUrl =
  "https://chatpdf-titan.s3.eu-north-1.amazonaws.com/uploads/1741353299690Adarsh-Vishwakarma.pdf";

export async function GET(req) {
  const response = await fetch(pdfUrl);
  console.log("HI-----------------------------------")
  const data = await response.blob();
  const loader = new PDFLoader(data);
  const docs = await loader.load();
  console.log(docs)
  let pdfTextContent = ''
  docs.forEach(doc=>{
    pdfTextContent=pdfTextContent+doc.pageContent
  })

console.log(pdfTextContent)
//   const splitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 100,
//     chunkOverlap: 20,
//   });


 
  
  // const output = await splitter.createDocuments([pdfTextContent]);
  // let splitterList:any = [];
  // output.forEach(doc=>{
  //   splitterList.push(doc.pageContent)
  // })

 
  
   
  return NextResponse.json({ pdfTextContent });
}
