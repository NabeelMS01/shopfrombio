import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .middleware(async ({ req }) => {
      // Optional: add auth logic here if needed
      return { userId: "anon" };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      // You can log or store metadata if needed
      return { uploadedUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter; 