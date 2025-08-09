"use client";

import { useState } from "react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { Button } from "@/components/ui/button";

export default function UploadImageField({ name = "images", defaultUrls = [] as string[] }: { name?: string; defaultUrls?: string[] }) {
  const [urls, setUrls] = useState<string[]>(defaultUrls);

  return (
    <div className="space-y-2">
      <UploadButton<OurFileRouter, "productImage">
        endpoint="productImage"
        onClientUploadComplete={(res) => {
          const newUrls = res?.map((f) => f.url).filter(Boolean) as string[];
          setUrls((prev) => [...prev, ...newUrls]);
        }}
        onUploadError={(e: Error) => {
          console.error("Upload failed", e);
        }}
      />

      {urls.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {urls.map((u) => (
            <div key={u} className="relative border rounded overflow-hidden">
              <img src={u} alt="uploaded" className="w-full h-24 object-cover" />
            </div>
          ))}
        </div>
      )}

      <input type="hidden" name={name} value={JSON.stringify(urls)} />
      {urls.length > 0 && (
        <Button type="button" variant="outline" size="sm" onClick={() => setUrls([])}>
          Clear Images
        </Button>
      )}
    </div>
  );
} 