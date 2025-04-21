import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DocumentPricingApp() {
  const [fileName, setFileName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [pages, setPages] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      // Dummy page count logic - replace with actual PDF/Word parser
      const count = 5; // Assume 5 pages for now
      setPageCount(count);
      setPages(Array(count).fill("bw"));
      calculatePrice(Array(count).fill("bw"));
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
      <Input type="file" accept=".pdf,.docx" onChange={handleFileUpload} />
      {fileName && <p className="text-sm text-gray-500">Uploaded: {fileName}</p>}

      {pageCount > 0 && (
        <Card>
          <CardContent className="space-y-4 p-4">
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
                  <option value="color_less">Color < Half (5 PHP)</option>
                  <option value="color_more">Color > Half (8 PHP)</option>
                </select>
              </div>
            ))}
            <div className="font-bold text-xl">Total Price: ₱{totalPrice}</div>
            <Button>Submit Order</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}