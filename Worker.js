const DEFAULT_ALLOWED_ORIGIN = "https://farhood-flow-ide.vercel.app";

const ALLOWED_MODELS = new Set([
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "gemma2-9b-it"
]);

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";

  const allowed = (env.ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN)
    .split(",")
    .map(value => value.trim())
    .filter(Boolean);

  const headers = new Headers({
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  });

  if (allowed.includes(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
  }

  return headers;
}

function jsonResponse(data, status, headers) {
  const resultHeaders = new Headers(headers);
  resultHeaders.set("Content-Type", "application/json; charset=utf-8");

  return new Response(JSON.stringify(data), {
    status,
    headers: resultHeaders
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);
    const origin = request.headers.get("Origin") || "";

    const allowed = (env.ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN)
      .split(",")
      .map(value => value.trim())
      .filter(Boolean);

    if (request.method === "OPTIONS") {
      if (origin && !allowed.includes(origin)) {
        return new Response("Origin not allowed", { status: 403 });
      }

      return new Response(null, {
        status: 204,
        headers: cors
      });
    }

    if (url.pathname === "/health" && request.method === "GET") {
      return jsonResponse({
        ok: true,
        service: "farhood-ai-worker"
      }, 200, cors);
    }

    if (url.pathname !== "/api/ai/chat" || request.method !== "POST") {
      return jsonResponse({
        error: "Not found"
      }, 404, cors);
    }

    if (origin && !allowed.includes(origin)) {
      return jsonResponse({
        error: "Origin not allowed"
      }, 403, cors);
    }

    if (!env.GROQ_API_KEY) {
      return jsonResponse({
        error: "GROQ_API_KEY secret is not configured"
      }, 500, cors);
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return jsonResponse({
        error: "Invalid JSON body"
      }, 400, cors);
    }

    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return jsonResponse({
        error: "messages must be a non-empty array"
      }, 400, cors);
    }

    const model = ALLOWED_MODELS.has(body.model)
      ? body.model
      : "llama-3.3-70b-versatile";

    const messages = body.messages.slice(-12).map(message => ({
      role: ["system", "user", "assistant"].includes(message?.role)
        ? message.role
        : "user",
      content: String(message?.content ?? "").slice(0, 16000)
    }));

    try {
      const upstream = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model,
            stream: true,
            temperature: 0.3,
            max_tokens: 2048,
            messages
          })
        }
      );

      if (!upstream.ok) {
        const errorText = await upstream.text();
        const errorHeaders = new Headers(cors);

        errorHeaders.set(
          "Content-Type",
          upstream.headers.get("Content-Type") ||
          "application/json; charset=utf-8"
        );

        return new Response(
          errorText || JSON.stringify({ error: "Groq request failed" }),
          {
            status: upstream.status,
            headers: errorHeaders
          }
        );
      }

      const responseHeaders = new Headers(cors);

      responseHeaders.set(
        "Content-Type",
        "text/event-stream; charset=utf-8"
      );

      responseHeaders.set("Cache-Control", "no-cache, no-transform");
      responseHeaders.set("X-Content-Type-Options", "nosniff");

      return new Response(upstream.body, {
        status: 200,
        headers: responseHeaders
      });

    } catch (error) {
      return jsonResponse({
        error: "AI upstream connection failed",
        details: String(error?.message || error)
      }, 502, cors);
    }
  }
};