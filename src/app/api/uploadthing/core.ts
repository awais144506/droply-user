import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTApi } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();
const utapi = new UTApi();

export const ourFileRouter = {

  // 1. Your existing branch logo endpoint
  branchLogo: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .input(z.object({ oldImageUrl: z.string().optional() }))
    .middleware(async ({ input }) => {
      return { oldImageUrl: input.oldImageUrl };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      if (metadata.oldImageUrl) {
        try {
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

  // 2. New endpoint for Subscription Payment Receipts
  paymentReceipt: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 },
  })
    .onUploadComplete(async ({ file }) => {
      console.log("✅ Payment receipt uploaded, URL:", file.ufsUrl);
      return { url: file.ufsUrl || file.url };
    }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;