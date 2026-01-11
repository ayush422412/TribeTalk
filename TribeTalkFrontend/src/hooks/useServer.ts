import { useDispatch, useSelector } from "react-redux"
import { setActiveServer } from "../stores/server.slice"
import type { RootState } from "../app/store";

export function useServer() {
  const dispatch = useDispatch()
  const servers = useSelector((s: RootState) => s.server.servers)
  const activeServerId = useSelector(
    (s: RootState) => s.server.activeServerId
  )

  return {
    servers,
    activeServerId,
    selectServer: (id: number) => dispatch(setActiveServer(id))
  }
}
