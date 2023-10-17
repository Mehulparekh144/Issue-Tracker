import z from 'zod'

const teamMembersObject = z.object({
  id : z.string(),
  email : z.string(),
  name : z.string(),
  image : z.string()
})

export const newTeamValidationSchema  = z.object({
  teamName : z.string().min(5, {message : "Team Name should be Minimum 5 Characters"}),
  teamMembers : z.array(teamMembersObject),
  // teamMembers : z.array(teamMembersObject).min(1 , {message : "Atleast 1 team member should be included"}),
})

export type NewTeamValidationSchema = z.infer<typeof newTeamValidationSchema> 