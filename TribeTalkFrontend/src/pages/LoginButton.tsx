import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() => loginWithRedirect()}
      className="
        px-11 py-4
        text-lg font-semibold uppercase tracking-wider
        rounded-xl
        bg-sky-400 text-[#1a1e27]
        shadow-xl
        transition-all duration-300 ease-out
        hover:bg-sky-500
        hover:-translate-y-1 hover:scale-105
        focus:outline-none focus:ring-4 focus:ring-sky-300
      "
    >
      Log In
    </button>
  );
};

export default LoginButton;
