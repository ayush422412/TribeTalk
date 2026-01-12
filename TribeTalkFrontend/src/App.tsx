import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './pages/LoginButton';
import LogoutButton from './pages/LogoutButton';
import Home from './pages/Home';

function App() {
  const { isAuthenticated, isLoading, error ,user} = useAuth0();
  console.log("User Info:", user);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1e27] text-slate-200">
        <div className="bg-[#2d313c] rounded-2xl px-12 py-10 shadow-2xl text-xl animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1e27] text-white">
        <div className="bg-red-600 rounded-2xl px-12 py-10 shadow-2xl text-center">
          <h1 className="text-4xl font-bold mb-2">Oops!</h1>
          <p className="text-lg mb-1">Something went wrong</p>
          <p className="text-sm opacity-80">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1e27] text-slate-200 relative">
      
      {isAuthenticated ? (
        <>
          {/* Logout button – top right */}
          <div className="fixed top-5 right-5 z-50">
            <LogoutButton />
            <p className="text-sm text-slate-300 mt-2">{user?.name}</p>
          </div>

          {/* Home starts from top */}
          <div className="">
            <Home />
          </div>
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-[#262a33] rounded-2xl shadow-2xl px-10 py-12 w-full max-w-md text-center">
            <p className="text-lg text-slate-300 mb-6">
              Get started by signing in to your account
            </p>
            <LoginButton />
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
