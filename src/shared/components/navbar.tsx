"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteCookie } from "../utils/cookie_handler";
import { useRouter } from "next/navigation";
import Loading from "./loading";
import { useSession } from "../utils/SessionProvider";

const Navbar = () => {
  const { token, user, setToken, setUser, isLoading } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    setIsLoggingOut(true);

    setToken(null);
    setUser(null);

    deleteCookie("authToken");

    setTimeout(() => {
      setIsLoggingOut(false);
      router.push("/login");
    }, 1000);
  };

  const profilePage = () => {
    router.push("/profile");
  };

  const homePage = () => {
    router.push("/home");
  };

  if (isLoading || isLoggingOut) {
    return <Loading />;
  }

  return (
    <nav className="bg-blue-600 px-8 py-4">
      <div className=" flex justify-between items-center">
        {/* Logo */}
        <button className="text-white text-lg font-semibold" onClick={homePage}>
          FoodRecipes
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {token ? (
            <>
              <button className="block text-white" onClick={profilePage}>
                {user?.first_name}
              </button>
              <button
                onClick={handleLogout}
                className="text-white hover:text-blue-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/register" className="text-white hover:text-blue-300">
                Register
              </Link>
              <Link href="/login" className="text-white hover:text-blue-300">
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden ${
          isMenuOpen ? "block" : "hidden"
        } mt-4 space-y-4`}
      >
        {token ? (
          <>
            <button className="block text-white" onClick={profilePage}>
              {user?.first_name}
            </button>
            <button
              onClick={handleLogout}
              className="block text-white hover:text-blue-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/register"
              className="block text-white hover:text-blue-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Register
            </Link>
            <Link
              href="/login"
              className="block text-white hover:text-blue-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
