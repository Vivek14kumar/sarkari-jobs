import { connectToDB } from "@/lib/mongodb";
import Token from "@/app/api/models/Token";

const FCM_URL = "https://fcm.googleapis.com/fcm/send";
const SERVER_KEY = process.env.FCM_SERVER_KEY;

// ------------ SEND A BATCH OF 1000 TOKENS -----------------
async function sendBatch(tokens, payload) {
  const body = {
    registration_ids: tokens,
    notification: {
      title: payload.title,
      body: payload.body,
      icon: "/icons/icon-192.png",
    },
    data: {
      ...payload.data,
      url: payload.url, // Important for click
    },
    priority: "high",
  };

  const res = await fetch(FCM_URL, {
    method: "POST",
    headers: {
      Authorization: `key=${SERVER_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return res.json();
}

// ------------ REMOVE INVALID FCM TOKENS AUTOMATICALLY -----------------
async function cleanupInvalidTokens(tokens, responses) {
  const toDelete = [];

  for (let b = 0; b < responses.length; b++) {
    const batchRes = responses[b];

    if (!batchRes.results) continue;

    batchRes.results.forEach((r, idx) => {
      if (r.error) {
        const token = tokens[b][idx];
        console.log("🔥 Removing invalid FCM token:", token);
        toDelete.push(token);
      }
    });
  }

  if (toDelete.length > 0) {
    await Token.deleteMany({ token: { $in: toDelete } });
    console.log(`🧹 Cleaned ${toDelete.length} invalid tokens`);
  }
}

// --------------------- MAIN POST -------------------------
export async function POST(req) {
  if (!SERVER_KEY)
    return new Response(
      JSON.stringify({ error: "FCM_SERVER_KEY missing" }),
      { status: 500 }
    );

  try {
    const body = await req.json();
    const title = body.title || "New Job Alert";
    const message = body.body || "A new vacancy is available on resultshub.in";
    const url = body.url || "https://resultshub.in";
    const data = body.data || {};

    await connectToDB();
    const tokens = await Token.find().select("token -_id");

    const allTokens = tokens.map((t) => t.token).filter(Boolean);

    if (allTokens.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0 }),
        { status: 200 }
      );
    }

    // Split into batches of 1000
    const batches = [];
    for (let i = 0; i < allTokens.length; i += 1000) {
      batches.push(allTokens.slice(i, i + 1000));
    }

    const responses = [];
    for (const batch of batches) {
      const result = await sendBatch(batch, {
        title,
        body: message,
        url,
        data,
      });
      responses.push(result);
    }

    // 🔥 Remove invalid & expired tokens
    await cleanupInvalidTokens(batches, responses);

    return new Response(
      JSON.stringify({
        success: true,
        batchCount: responses.length,
        sent: allTokens.length,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("SEND NOTIFICATION ERROR:", err);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
