import z from 'zod'



export const newTeamValidationSchema  = z.object({
  teamName : z.string().min(5, {message : "Team Name should be Minimum 5 Characters"}),

})

export type NewTeamValidationSchema = z.infer<typeof newTeamValidationSchema> 