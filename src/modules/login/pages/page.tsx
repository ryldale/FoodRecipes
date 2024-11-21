"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { api, serverAPI } from "@/core/api/api";
import { AxiosError } from "axios";
import { useSession } from "@/shared/utils/SessionProvider";
import Loading from "@/shared/components/loading";
import { setCookie } from "@/shared/utils/cookie_handler";

const LoginPage = () => {
  const { setToken, setUser } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  if (loading) {
    return <Loading />;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await serverAPI.post(api.login, {
        email,
        password,
      });

      const { token, user } = response.data;

      setCookie("authToken", token, 60);

      setToken(token);
      setUser(user);

      serverAPI.defaults.headers["Authorization"] = `Bearer ${token}`;

      router.push("/home");
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        const errorMessage = err.response.data.message;
        setError(errorMessage);
      } else {
        alert("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* ERROR MESSAGE */}
          {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className={`w-full py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-500 hover:bg-blue-600 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
