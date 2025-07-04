import Link from "next/link";

export default function Hero() {
  return (
    <section className="h-screen flex items-center px-10">
      <div className="max-w-4xl">
        <h1 className="text-6xl pb-6">
          The Most Advanced Agentic AI for making newsletters
        </h1>
        <p className="text-neutral-500">
          Xploit Agent is the fastest way to automate end-to-end penetration
          testing—from initial reconnaissance to exploit delivery. The ultimate
          AI-powered offensive security partner.
        </p>
      </div>

      <Link href="/news/create/newsletter-creator">
        <button>Try now !</button>
      </Link>
    </section>
  );
}
