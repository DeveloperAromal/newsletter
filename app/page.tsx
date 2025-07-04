"use client";

import Image from "next/image";
import { useState } from "react";

import { useRouter } from "next/navigation";

export default function Home() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

    if (res.ok) {
      console.log("✅ Login success:", result);
      localStorage.setItem("access_token", result.accessToken);

      if (result.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/news/create/create-newsletters");
      }
    } else {
      alert(result.message);
    }
  };
  return (
    <main className="flex min-h-screen">
      <div className="flex w-full items-center justify-center bg-neutral-900 p-4 lg:w-1/2">
        <div className="flex w-full max-w-sm flex-col items-center rounded-xl p-6  transition-all duration-300">
          <div className="mb-6 transform transition-transform duration-300 hover:scale-105">
            <Image
              src="/logo.ico" // Make sure this path is correct for your logo
              alt="App Logo"
              width={150} // Smaller logo
              height={150} // Smaller logo
              className="rounded-full"
            />
          </div>

          {/* Title */}
          <h1 className="mb-6 text-center text-2xl font-bold text-emerald-400">
            Welcome Back!
          </h1>

          {/* Form */}
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
                aria-label="Email address input"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full rounded-md border border-gray-300 py-2.5 px-3 text-base placeholder-gray-500 shadow-sm transition-all duration-300 focus:border-lime-500 focus:ring-1 focus:ring-lime-500 focus:outline-none"
                aria-label="Password input"
                required
              />
            </div>

            <button
              type="button"
              onClick={handleLogin}
              className="w-full rounded-md  bg-gradient-to-l from-green-500 to-lime-300 py-2.5 px-3 text-base font-semibold text-zinc-900 shadow-md transition-all duration-300 hover:bg-lime-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>

      {/* Right Side: Background Image */}
      {/* This div will only be visible on larger screens (lg breakpoint and up) */}
      <div
        className="hidden lg:flex lg:w-2/2 items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/your-background-image.jpg')" }} // Replace with your actual image path
      >
        {/* You can add an overlay or content here if needed */}
        <div className="flex h-full w-full items-center justify-center bg-black bg-opacity-30 p-4 text-white">
          <h2 className="text-center text-4xl font-bold">
            Your Catchy Slogan Here
          </h2>
        </div>
      </div>
    </main>
  );
}
