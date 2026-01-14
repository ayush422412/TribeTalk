import type { PropsWithChildren } from "react"
import { useAuthInit } from "../hooks/useAuthInit"

export const AuthProvider = ({ children }: PropsWithChildren) => {
  useAuthInit()
  return <>{children}</>
}
