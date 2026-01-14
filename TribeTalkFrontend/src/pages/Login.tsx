import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authApi } from "../features/auth/auth.api"
import { useAuth } from "../features/auth/useAuth"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { setAuth } = useAuth()

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const loginRes = await authApi.login({ email, password })
      console.log(loginRes)
      console.log( loginRes.data?.data?.accessToken)
      const { data: user } = await authApi.getCurrentUser()
      
      setAuth(user, loginRes.data?.data?.accessToken ?? null)

      navigate("/home", { replace: true })
    } catch (err) {
      console.error("Login failed", err)
      alert("Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center gap-6 h-[600px] w-[600px] border-4 rounded-xl bg-blue-300">
        <h1 className="text-4xl font-serif">Login</h1>

        <form
          onSubmit={submitHandler}
          className="flex flex-col gap-4 items-center"
        >
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="outline-none bg-transparent border-2 border-emerald-600 font-medium text-lg py-2 px-6 rounded-full"
          />

          <input
            type="password"
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="outline-none bg-transparent border-2 border-emerald-600 font-medium text-lg py-2 px-6 rounded-full"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-7 text-white hover:bg-emerald-700 bg-emerald-600 text-lg py-2 px-8 w-full rounded-full"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
