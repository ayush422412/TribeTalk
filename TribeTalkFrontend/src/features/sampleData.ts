// sampleData.ts
import type { Server, Channel } from "./types"

export const sampleServers: Server[] = [
  { id: 1, name: "Server 1" },
  { id: 2, name: "Server 2" },
  { id: 3, name: "Server 3" },
]

export const sampleChannelsByServer: Record<number, Channel[]> = {
  1: [
    { id: 1, name: "A", serverId: 1 },
    { id: 2, name: "B", serverId: 1 },
    { id: 3, name: "C", serverId: 1 },
  ],
  2: [
    { id: 4, name: "D", serverId: 2 },
    { id: 5, name: "E", serverId: 2 },
    { id: 6, name: "F", serverId: 2 },
  ],
  3: [
    { id: 7, name: "G", serverId: 3 },
    { id: 8, name: "H", serverId: 3 },
    { id: 9, name: "I", serverId: 3 },
  ],
}
