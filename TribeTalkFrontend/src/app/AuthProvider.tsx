import { useState, useEffect, type PropsWithChildren } from "react"
import { useAuthInit } from "../hooks/useAuthInit"

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isLoading, setIsLoading] = useState(true)

  const authInitPromise = useAuthInit()

  useEffect(() => {
    authInitPromise.finally(() => setIsLoading(false))
  }, [authInitPromise])

  if (isLoading) {
    // Render nothing or a spinner while auth is initializing
    return <div>Loading...</div>
  }

  return <>{children}</>
}
