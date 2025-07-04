"use client";

import Navbar from "@/app/components/includes/Navbar";
import { Sparkles } from "lucide-react";
import { useState } from "react";

export default function Hero() {
  const [formData, setFormData] = useState({
    link: "",
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [scrapeData, setScrapeData] = useState();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [summaryData, setSummaryData] = useState();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [newsletterData, setNewsLetterData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false); // ✅ loader state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const scrapeRes = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formData.link }),
      });
      if (!scrapeRes.ok) throw new Error("Scrape API error");
      const scrapeJson = await scrapeRes.json();
      setScrapeData(scrapeJson);

      const summaryRes = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: scrapeJson }),
      });
      if (!summaryRes.ok) throw new Error("Summary API error");
      const summaryJson = await summaryRes.json();
      setSummaryData(summaryJson);

      const newsletterRes = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link: formData.link, transcript: summaryJson }),
      });
      if (!newsletterRes.ok) throw new Error("Newsletter API error");
      const newsletterJson = await newsletterRes.json();
      setNewsLetterData(newsletterJson);
    } catch (e) {
      console.error("Error in generating newsletter:", e);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <section className="text-black px-10 h-auto">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-2xl">
          <div className="pb-10">
            <h2 className="text-center text-5xl font-semibold pb-2">
              Transform URL into Powerful{" "}
              <span className="text-green-600">Newsletters</span>
            </h2>
            <p className="text-neutral-700 text-center">
              Paste any article or YouTube video link, and let AI generate a
              crisp newsletter. Push directly to WhatsApp with one click.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md w-full inline-flex"
          >
            <input
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="Paste your link here..."
              className="w-full focus:border-green-600 outline-none border-2 border-green-600 h-16 pl-4 rounded-tl-md rounded-bl-md"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center h-auto gap-2 bg-green-600 text-white rounded-tr-md rounded-br-md px-8 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Generate <Sparkles />
                </>
              )}
            </button>
          </form>

          {/* Newsletter Output */}
          <div className="mt-12">
            <h1 className="text-2xl font-semibold mb-4">
              Here is the generated Newsletter
            </h1>

            {/* Skeleton */}
            {isLoading && (
              <div className="mt-6 animate-pulse space-y-4 border rounded-md p-6 shadow-sm">
                <div className="h-6 bg-gray-300 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-2/4" />
              </div>
            )}

            {/* Final Result */}
            {!isLoading && newsletterData && (
              <div className="mt-6 border rounded-md p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-green-700 mb-2">
                  {newsletterData.title}
                </h2>

                {/* Optional thumbnail */}
                {/* <img
                  src={newsletterData.thumbnail}
                  alt="thumbnail"
                  className="w-full h-48 object-cover rounded-md mb-4"
                /> */}

                <p className="text-md mb-2">
                  <strong>Quick Glance:</strong> {newsletterData.quick_glance}
                </p>

                <ul className="list-disc pl-5 text-neutral-800 mb-2">
                  {newsletterData.details?.map((point: string, idx: number) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>

                <p className="italic text-sm text-gray-700">
                  <strong>Takeaway:</strong> {newsletterData.what_to_take_home}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
