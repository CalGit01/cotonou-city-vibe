export const PEOPLE = {
  businessMaleA: "/models/people/businessMaleA.glb",
  businessMaleB: "/models/people/businessMaleB.glb",
  casualMaleA: "/models/people/casualMaleA.glb",
  casualMaleB: "/models/people/casualMaleB.glb",
  casualFemaleA: "/models/people/casualFemaleA.glb",
  casualFemaleB: "/models/people/casualFemaleB.glb",
  athleteMaleBlue: "/models/people/athleteMaleBlue.glb",
  athleteFemaleBlue: "/models/people/athleteFemaleBlue.glb",
} as const

export type PersonKey = keyof typeof PEOPLE
