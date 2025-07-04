"use client";

import Navbar from "@/app/components/includes/Navbar";
import { Sparkles } from "lucide-react";
import { useState } from "react";

interface NewsletterData {
  title: string;
  quick_glance: string;
  details: string[];
  what_to_take_home: string;
  thumbnail?: string;
}

export default function Hero() {
  const [formData, setFormData] = useState({
    link: "",
  });

  const isYouTube = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(
    formData.link
  );

  const [newsletterData, setNewsLetterData] = useState<NewsletterData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNewsLetterData(null);

    try {
      const scrapeRes = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(isYouTube ? { videoUrl: formData.link } : { url: formData.link }),
        }),
      });
      if (!scrapeRes.ok) throw new Error("Scrape API error");
      const scrapeJson = await scrapeRes.json();

      const summaryRes = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: scrapeJson }),
      });
      if (!summaryRes.ok) throw new Error("Summary API error");
      const summaryJson = await summaryRes.json();

      const newsletterRes = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link: formData.link, transcript: summaryJson }),
      });
      if (!newsletterRes.ok) throw new Error("Newsletter API error");
      const newsletterJson: NewsletterData = await newsletterRes.json();
      setNewsLetterData(newsletterJson);
    } catch (e) {
      console.error("Error in generating newsletter:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-white to-green-50 text-gray-900 px-6 sm:px-10 font-sans">
      <Navbar />
      <div className="flex items-center justify-center h-screen pt-16 pb-10">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl text-bold leading-tight mb-4">
              Transform URLs into Engaging{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-green-500 to-lime-300 drop-shadow-md">
                Newsletters
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-prose mx-auto">
              Simply paste any article or YouTube video link and let our AI
              craft a concise, shareable newsletter. Push directly to WhatsApp
              with a single click.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-stretch bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-green-500 transition-all duration-300"
          >
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              placeholder="Paste your article or video link here..."
              className="flex-grow p-4 text-lg border-none outline-none focus:ring-0 placeholder-gray-400"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center bg-gradient-to-l from-green-500 to-lime-300 justify-center gap-2 px-8 py-4 text-white text-lg font-semibold hover:bg-green-700 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Generate <Sparkles className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {(isLoading || newsletterData) && (
            <div className="mt-16 mb-20">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Your Generated Newsletter
              </h2>
              <div className="bg-green-50 rounded-xl shadow-xl p-8 border border-green-200 max-h-96 overflow-y-auto custom-scrollbar">
                {isLoading && (
                  <div className="animate-pulse space-y-5">
                    <div className="h-8 bg-gradient-to-l from-green-100 to-lime-100 rounded-full w-3/4 mx-auto mb-6" />
                    <div className="h-5 bg-gradient-to-l from-emerald-100 to-lime-100 rounded-full w-full" />
                    <div className="h-5 bg-gradient-to-l from-emerald-100 to-lime-100 rounded-full w-11/12" />
                    <div className="h-5 bg-gradient-to-l from-emerald-100 to-lime-100 rounded-full w-5/6" />
                    <div className="h-5 bg-gradient-to-l from-emerald-100 to-lime-100 rounded-full w-full" />
                    <div className="h-5 bg-gradient-to-l from-emerald-100 to-lime-100 rounded-full w-10/12" />
                    <div className="h-5 bg-gradient-to-l from-emerald-100 to-lime-100 rounded-full w-3/4" />
                  </div>
                )}

                {!isLoading && newsletterData && (
                  <div>
                    {/* {newsletterData.thumbnail && (
                      <img
                        src={newsletterData.thumbnail}
                        alt="Newsletter Thumbnail"
                        className="w-full h-56 object-cover rounded-lg mb-6 shadow-md"
                      />
                    )} */}
                    <h3 className="text-3xl font-bold text-green-700 mb-4 leading-tight">
                      {newsletterData.title}
                    </h3>

                    <p className="text-lg mb-4 text-gray-700 leading-relaxed">
                      <strong className="text-gray-800">Quick Glance:</strong>{" "}
                      {newsletterData.quick_glance}
                    </p>

                    <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                      {newsletterData.details?.map(
                        (point: string, idx: number) => (
                          <li key={idx} className="leading-relaxed">
                            {point}
                          </li>
                        )
                      )}
                    </ul>

                    <p className="italic text-md text-gray-600 border-t border-gray-200 pt-4 mt-4">
                      <strong className="not-italic text-gray-700">
                        Key Takeaway:
                      </strong>{" "}
                      {newsletterData.what_to_take_home}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
