import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";

export default function DocumentPricingApp() {
  const [fileName, setFileName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [pages, setPages] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setFileName(file.name);

      const fileReader = new FileReader();
      fileReader.onload = async function () {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        const count = pdf.numPages;
        setPageCount(count);
        setPages(Array(count).fill("bw"));
        calculatePrice(Array(count).fill("bw"));
      };
      fileReader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a PDF file only.");
    }
  };

  const handlePageChange = (index, value) => {
    const updatedPages = [...pages];
    updatedPages[index] = value;
    setPages(updatedPages);
    calculatePrice(updatedPages);
  };

  const calculatePrice = (pages) => {
    let total = 0;
    pages.forEach((type) => {
      if (type === "bw") total += 2;
      else if (type === "color_less") total += 5;
      else if (type === "color_more") total += 8;
    });
    setTotalPrice(total);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">📄 Document Price Calculator</h1>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
        className="border p-2 rounded"
      />
      {fileName && <p className="text-sm text-gray-600">Uploaded: {fileName}</p>}

      {pageCount > 0 && (
        <div className="bg-white p-4 rounded shadow space-y-4">
          <h2 className="font-semibold">Select print type for each page:</h2>
          {pages.map((type, index) => (
            <div key={index} className="flex items-center gap-4">
              <span>Page {index + 1}:</span>
              <select
                value={type}
                onChange={(e) => handlePageChange(index, e.target.value)}
                className="border p-1 rounded"
              >
                <option value="bw">Black & White (2 PHP)</option>
                <option value="color_less">Color &lt; Half (5 PHP)</option>
                <option value="color_more">Color &gt; Half (8 PHP)</option>
              </select>
            </div>
          ))}
          <div className="font-bold text-xl">Total Price: ₱{totalPrice}</div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit Order</button>
        </div>
      )}
    </div>
  );
}
