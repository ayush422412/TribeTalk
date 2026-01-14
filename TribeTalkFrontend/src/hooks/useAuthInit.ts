import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { authApi } from "../features/auth/auth.api"
import { setAuth, clearAuth } from "../features/auth/authStore/auth.slice"
import type { AppDispatch } from  "../features/auth/authStore/auth.store"

export const useAuthInit = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const init = async () => {
      try {
        
        const { data: user } = await authApi.getCurrentUser()
        console.log("authinit")
        
        const { data } = await authApi.refreshToken()
        console.log("authinitdfbvdsf",data?.data?.accessToken)

        dispatch(
          setAuth({
            user,
            token: data?.data?.accessToken,
          })
        )
      } catch {
        dispatch(clearAuth())
      }
    }

    init()
  }, [dispatch])
}
 