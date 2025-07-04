"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

export default function Home() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const result = await res.json();

    if (res.ok && result.session?.access_token) {
      toast.success("Login sucessfull");
      toast.success("Redirecting....");
      localStorage.setItem("access_token", result.session.access_token);

      if (result.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/news/create/create-newsletters");
      }
    } else {
      toast.success("Login Failed");
    }
  };

  return (
    <main className="flex min-h-screen">
      <ToastContainer />
      <div className="flex w-full items-center justify-center bg-neutral-900 p-4 lg:w-1/2">
        <div className="flex w-full max-w-sm flex-col items-center rounded-xl p-6 transition-all duration-300">
          <div className="mb-6 transform transition-transform duration-300 hover:scale-105">
            <Image
              src="/logo.ico"
              alt="App Logo"
              width={150}
              height={150}
              className="rounded-full"
            />
          </div>

          <h1 className="mb-6 text-center text-2xl font-bold text-emerald-400">
            Welcome Back!
          </h1>

          <form className="w-full space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                placeholder="Enter your email"
                className="w-full rounded-md border border-gray-300 py-2.5 px-3 text-base placeholder-gray-500 shadow-sm transition-all duration-300 focus:border-lime-500 focus:ring-1 focus:ring-lime-500 focus:outline-none"
                required
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full rounded-md border border-gray-300 py-2.5 px-3 pr-10 text-base placeholder-gray-500 shadow-sm transition-all duration-300 focus:border-lime-500 focus:ring-1 focus:ring-lime-500 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="button"
              onClick={handleLogin}
              className="w-full rounded-md bg-gradient-to-l from-green-500 to-lime-300 py-2.5 px-3 text-base font-semibold text-zinc-900 shadow-md transition-all duration-300 hover:bg-lime-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-2/2 items-center justify-center bg-cover bg-center background">
        <div className="flex h-full w-full items-center justify-center p-4 text-white">
          <div>
            <h2 className="text-center text-5xl font-bold">
              Where Future Meets Excellence
            </h2>
            <p className="text-center text-lg text-neutral-200 mt-4 max-w-2xl mx-auto">
              Empowering the next generation with knowledge, values, and
              innovation — guiding every student toward a brighter tomorrow.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
