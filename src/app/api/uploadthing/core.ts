import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { db } from "@/db";

const f = createUploadthing();
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "512MB" } })
    .middleware(async ({ req }) => {
      const session = await getServerSession(authOptions);
      if (!session || !session.user || session.user.role != 'ADMIN') {
        throw new Error("Unauthorized")
      }
      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const createdImage = await db.image.create({
          data: {
            key: file.key,
            url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
            name: file.name,
          }
        })
      } catch (error) {
        console.log(error)
        throw new Error(
          "Unauthorized"
        )
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;