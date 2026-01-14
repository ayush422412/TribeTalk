import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { authApi } from "../features/auth/auth.api"

function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      setLoading(true)

      await authApi.register({ username, email, password })

      navigate("/login", { replace: true })
    } catch (error) {
      console.error("Registration failed", error)
      alert("Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center gap-6 h-[700px] w-[600px] border-4 rounded-xl bg-blue-300">
        <h1 className="text-4xl font-serif">Sign Up</h1>

        <form
          onSubmit={submitHandler}
          className="flex flex-col gap-4 items-center"
        >
          <input
            type="text"
            value={username}
            required
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
            className="outline-none bg-transparent border-2 border-emerald-600 font-medium text-lg py-2 px-6 rounded-full"
          />

          <input
            type="email"
            value={email}
            required
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="outline-none bg-transparent border-2 border-emerald-600 font-medium text-lg py-2 px-6 rounded-full"
          />

          <input
            type="password"
            value={password}
            required
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            className="outline-none bg-transparent border-2 border-emerald-600 font-medium text-lg py-2 px-6 rounded-full"
          />

          <input
            type="password"
            value={confirmPassword}
            required
            placeholder="Confirm your password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="outline-none bg-transparent border-2 border-emerald-600 font-medium text-lg py-2 px-6 rounded-full"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-full w-full"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
