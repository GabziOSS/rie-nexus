import type { User } from "../types"

const FIRST_NAMES = [
  "Maria",
  "Juan",
  "Pedro",
  "Ana",
  "Carlos",
  "Sofia",
  "Luis",
  "Carmen",
  "Miguel",
  "Isabel",
  "Roberto",
  "Teresa",
]

const LAST_NAMES = [
  "Santos",
  "Cruz",
  "Mendoza",
  "Ramos",
  "Torres",
  "Garcia",
  "Lopez",
  "Martinez",
  "Diaz",
  "Reyes",
  "Vargas",
  "Morales",
]

const ROLES: Array<"admin" | "operator" | "analyst" | "viewer"> = [
  "admin",
  "operator",
  "operator",
  "operator",
  "operator",
  "operator",
  "analyst",
  "analyst",
  "viewer",
  "viewer",
  "viewer",
  "viewer",
]

/**
 * Generate 12 users
 */
export function generateUsers(): User[] {
  return ROLES.map((role, index) => {
    const firstName = FIRST_NAMES[index]
    const lastName = LAST_NAMES[index]
    const name = `${firstName} ${lastName}`
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@city.gov`

    // Zone assignments based on role
    let zoneIds: string[]
    switch (role) {
      case "admin":
        zoneIds = [
          "zone-1",
          "zone-2",
          "zone-3",
          "zone-4",
          "zone-5",
          "zone-6",
          "zone-7",
          "zone-8",
          "zone-9",
          "zone-10",
          "zone-11",
          "zone-12",
        ]
        break
      case "operator":
        zoneIds = [
          ["zone-1", "zone-2"],
          ["zone-3", "zone-4"],
          ["zone-5", "zone-6"],
          ["zone-7", "zone-8"],
          ["zone-9", "zone-10"],
        ][index - 1] || ["zone-1", "zone-2"]
        break
      case "analyst":
        zoneIds = ["zone-1", "zone-2", "zone-3", "zone-4", "zone-5", "zone-6"]
        break
      default:
        zoneIds = []
    }

    return {
      id: `user-${index + 1}`,
      name,
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=random`,
      zoneIds,
    }
  })
}
