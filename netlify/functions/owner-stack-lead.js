const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body),
  };
}

function parseBody(event) {
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body || "", "base64").toString("utf8")
    : event.body || "";
  const contentType = event.headers["content-type"] || event.headers["Content-Type"] || "";

  if (contentType.includes("application/json")) {
    return JSON.parse(rawBody || "{}");
  }

  const params = new URLSearchParams(rawBody);
  return Object.fromEntries(params.entries());
}

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function buildTelegramMessage(lead) {
  const name = clean(lead.name) || "Not provided";
  const email = clean(lead.email);
  const source = clean(lead.source) || "Owner Stack Website Gate";
  const pageUrl = clean(lead.pageUrl) || "Unknown page";
  const referrer = clean(lead.referrer) || "Direct / unknown";
  const submittedAt = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York",
  });

  return [
    "New OwnYourWeb lead",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Source: ${source}`,
    `Page: ${pageUrl}`,
    `Referrer: ${referrer}`,
    `Submitted: ${submittedAt} ET`,
  ].join("\n");
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  let lead;
  try {
    lead = parseBody(event);
  } catch {
    return json(400, { error: "Invalid request body" });
  }

  if (clean(lead.website)) {
    return json(200, { ok: true });
  }

  const email = clean(lead.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { error: "A valid email is required" });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return json(500, { error: "Telegram environment variables are not configured" });
  }

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: buildTelegramMessage({ ...lead, email }),
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    return json(502, { error: "Telegram notification failed" });
  }

  return json(200, { ok: true });
};
