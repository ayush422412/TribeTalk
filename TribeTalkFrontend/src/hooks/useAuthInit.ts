import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { authApi } from "../features/auth/auth.api"
import { setAuth, clearAuth } from "../features/auth/authStore/auth.slice"
// import type { AppDispatch } from "../features/auth/authStore/auth.store"
import type { AppDispatch } from "../app/store"

export const useAuthInit = () => {
  const dispatch = useDispatch<AppDispatch>()

  return new Promise<void>((resolve) => {
    const init = async () => {
      try {
        const user = await dispatch(authApi.endpoints.getCurrentUser.initiate()).unwrap()
        const tokenData = await dispatch(authApi.endpoints.refreshToken.initiate()).unwrap()
        dispatch(
          setAuth({
            user,
            token: tokenData?.data?.accessToken ?? null,
          })
        )
      } catch (err) {
        console.error("Auth initialization failed", err)
        dispatch(clearAuth())
      } finally {
        resolve()
      }
    }
    init()
  })
}
