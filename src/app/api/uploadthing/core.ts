import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTApi } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();
const utapi = new UTApi(); // 🔥 Initialize UTApi

export const ourFileRouter = {

  branchLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    // 1. Accept the old URL from the frontend safely
    .input(z.object({ oldImageUrl: z.string().optional() }))

    // 2. Pass it through the middleware
    .middleware(async ({ input }) => {
      return { oldImageUrl: input.oldImageUrl };
    })

    // 3. After the NEW file uploads, delete the OLD file
    .onUploadComplete(async ({ metadata, file }) => {

      if (metadata.oldImageUrl) {
        try {
          // 🔥 Bulletproof way to extract the File Key from ANY UploadThing URL format
          const urlParts = metadata.oldImageUrl.split("/");
          const fileKey = urlParts[urlParts.length - 1];

          if (fileKey) {
            await utapi.deleteFiles(fileKey);
            console.log("🗑️ Successfully deleted old logo:", fileKey);
          }
        } catch (error) {
          console.error("Failed to delete old image:", error);
        }
      }

      console.log("✅ Upload complete, New File URL:", file.ufsUrl);
      return { uploadedBy: "admin", url: file.ufsUrl };
    }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;