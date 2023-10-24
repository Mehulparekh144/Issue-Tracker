import z from 'zod'

export const newIssueValidationSchema = z.object({
  issueName: z.string().min(4, { message: "Issue name should be atleast 4 characters" }),
  issueDescription: z.string().min(10, { message: "Issue description should be atleast 10 characters" }),
  deadlineDate: z.date().refine((deadline) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return deadline > today
  }, { message: "Assign deadline after today" }),
  priority: z.enum(["URGENT", "HIGH", "MEDIUM", "LOW"]),
  team: z.string().min(1, { message: "Assign only one team" })

})

export type NewIssueValidationSchema = z.infer<typeof newIssueValidationSchema>