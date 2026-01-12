import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
      className="
        px-8 py-3
        text-base font-semibold uppercase tracking-wider
        rounded-xl
        bg-red-400 text-[#1a1e27]
        shadow-xl
        transition-all duration-300 ease-out
        hover:bg-red-500
        hover:-translate-y-1 hover:scale-105
        focus:outline-none focus:ring-4 focus:ring-red-300
      "
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
