export async function POST(req: Request) {
  try {
    const postData = await req.json();

    const incomingUrl = postData.url || "";

    const isYouTube = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//i.test(
      incomingUrl
    );

    const apiUrl = isYouTube
      ? "https://yt-transcript-osle.onrender.com/transcript"
      : "https://newsletter-backend-kfg7.onrender.com/api/v1/scrape/web";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ detail: "Error posting data" }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify({ detail: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
