import { db } from "@/db";
import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { authOptions } from "../auth/[...nextauth]/route";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ }) => {
      const session = await getServerSession(authOptions);
      if (!session || !session.user || session.user.role != "ADMIN") throw new Error("Unauthorized")
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.tempImage.create(
        {
          data:
          {
            name: file.name,
            key: file.key,
            url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
          }
        }
      )
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;