"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { Eye, EyeOff } from "lucide-react";

export default function AdminPanel() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("/api/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    });

    const result = await res.json();

    if (res.ok) {
      console.log("✅ User created successfully:", result);
      toast.success("User created successfully");

      // 🔔 Send welcome email
      const mailRes = await fetch("/api/mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: formData.email,
          email: formData.email,
          password: formData.password,
        }),
      });

      const mailResult = await mailRes.json();
      if (mailRes.ok) {
        toast.success("✉️ Welcome email sent");
      } else {
        console.error("❌ Failed to send email:", mailResult);
        toast.error("Failed to send welcome email");
      }

      // Optionally clear form
      setFormData({ name: "", email: "", password: "" });
    } else {
      console.error("❌ Error creating user:", result);
      toast.error(result.message || "Something went wrong!");
    }
  };

  return (
    <section>
      <ToastContainer />
      <div>
        <div className="flex justify-end">
          <Link href="/news/create/create-newsletters">
            <button className="bg-gradient-to-l px-4 py-4 inline-flex gap-2 from-green-500 to-lime-500 text-white">
              Navigate to newsletters <ArrowRight />
            </button>
          </Link>
        </div>
        <div>
          <div className="flex items-center justify-center h-[90vh] w-full">
            <div className="bg-zinc-50 px-4 py-6 rounded-2xl w-[400px]">
              <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
                Create User
              </h2>
              <form className="space-y-6" onSubmit={handleCreateUser}>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john.doe@example.com"
                    className="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
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
                    className="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
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

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                  >
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
