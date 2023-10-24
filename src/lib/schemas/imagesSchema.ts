import z from 'zod'

// [
//   {
//     "id": "clo46m23g000gy08c2q5kxitl",
//     "url": "https://uploadthing-prod.s3.us-west-2.amazonaws.com/b1e94b97-1585-4d14-b8d4-377053cb0ff7-8dmwtx.png",
//     "key": "b1e94b97-1585-4d14-b8d4-377053cb0ff7-8dmwtx.png",
//     "name": "checklist1.png"
//   }
// ]
export const imageObjectSchema = z.object({
  id : z.string(),
  url : z.string(),
  key : z.string(),
  name : z.string()

})

export type ImageObjectSchema = z.infer<typeof imageObjectSchema>