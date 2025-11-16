// /src/app/api/sendNotification/route.js
import { google } from "googleapis";
import { connectToDB } from "@/lib/mongodb";
import Token from "@/app/api/models/Token";

/**
 * Send FCM notifications via Firebase HTTP v1 API
 * @param {string[]} tokens - Array of FCM tokens
 * @param {object} payload - { title, body, url, data }
 */
async function sendFCMMessage(tokens, payload) {
  if (!process.env.FCM_SERVICE_ACCOUNT_JSON) {
    throw new Error("FCM_SERVICE_ACCOUNT_JSON missing");
  }

  // Parse service account JSON
  const serviceAccount = JSON.parse(process.env.FCM_SERVICE_ACCOUNT_JSON);
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

  // Google Auth
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
  });
  const client = await auth.getClient();
  const accessToken = (await client.getAccessToken()).token;

  const results = [];

  for (const token of tokens) {
    const body = {
      message: {
        token,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: {
          ...payload.data,
          url: payload.url,
        },
        android: { priority: "high" },
        apns: { headers: { "apns-priority": "10" } },
      },
    };

    try {
      const res = await fetch(
        `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      let result;
      try {
        result = await res.json();
      } catch {
        result = { error: `HTTP ${res.status}` };
      }

      results.push(result);

    } catch (err) {
      results.push({ error: err.message });
    }
  }

  return results;
}

// Remove invalid tokens
async function cleanupInvalidTokens(tokens, responses) {
  const toDelete = [];
  responses.forEach((res, idx) => {
    if (res.error) {
      toDelete.push(tokens[idx]);
      console.log("🔥 Removing invalid FCM token:", tokens[idx], res.error);
    }
  });

  if (toDelete.length > 0) {
    await Token.deleteMany({ token: { $in: toDelete } });
    console.log(`🧹 Cleaned ${toDelete.length} invalid tokens`);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const title = body.title || "New Job Alert";
    const message = body.body || "A new vacancy is available on resultshub.in";
    const url = body.url || "https://resultshub.in";
    const data = body.data || {};

    await connectToDB();
    const tokens = await Token.find().select("token -_id");
    const allTokens = tokens.map(t => t.token).filter(Boolean);

    if (allTokens.length === 0) {
      return new Response(JSON.stringify({ success: true, sent: 0 }), { status: 200 });
    }

    // Send notifications
    const responses = await sendFCMMessage(allTokens, { title, body: message, url, data });

    // Cleanup invalid tokens
    await cleanupInvalidTokens(allTokens, responses);

    return new Response(JSON.stringify({ success: true, sent: allTokens.length }), { status: 200 });

  } catch (err) {
    console.error("SEND NOTIFICATION ERROR:", err);
    return new Response(JSON.stringify({ error: err.message || "Server error" }), { status: 500 });
  }
}
