import { useState } from "react";

const SignIn = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted:", email, password);

    setEmail("");
    setPassword("");
  };

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
            className="outline-none bg-transparent border-2 border-emerald-600 font-medium text-lg py-2 px-6 rounded-full"
          />

          <input
            type="password"
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            className="outline-none bg-transparent border-2 border-emerald-600 font-medium text-lg py-2 px-6 rounded-full"
          />

          <button
            type="submit"
            className="mt-7 text-white hover:bg-emerald-700 bg-emerald-600 text-lg py-2 px-8 w-full rounded-full"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
