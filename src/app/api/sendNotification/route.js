import { google } from "googleapis";
import { connectToDB } from "@/lib/mongodb";
import Token from "@/app/api/models/Token";

// FCM v1 URL
const FCM_URL = "https://fcm.googleapis.com/v1/projects/YOUR_PROJECT_ID/messages:send";

// Helper: send message via Firebase v1
async function sendFCMMessage(tokens, payload) {
  // Parse service account from env
  if (!process.env.FCM_SERVICE_ACCOUNT_JSON) {
    throw new Error("FCM_SERVICE_ACCOUNT_JSON missing");
  }

  const serviceAccount = JSON.parse(process.env.FCM_SERVICE_ACCOUNT_JSON);
  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

  // Auth client
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
  });

  const client = await auth.getClient();

  // Loop through tokens
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
        android: {
          priority: "high",
        },
        apns: {
          headers: { "apns-priority": "10" },
        },
      },
    };

    const res = await fetch(
      `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${await client.getAccessToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    results.push(await res.json());
  }

  return results;
}

// Cleanup invalid tokens (optional)
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

    const responses = await sendFCMMessage(allTokens, { title, body: message, url, data });
    await cleanupInvalidTokens(allTokens, responses);

    return new Response(
      JSON.stringify({
        success: true,
        sent: allTokens.length,
      }),
      { status: 200 }
    );

  } catch (err) {
    console.error("SEND NOTIFICATION ERROR:", err);
    return new Response(JSON.stringify({ error: err.message || "Server error" }), { status: 500 });
  }
}
