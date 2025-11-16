import { google } from "google-auth-library";
import { connectToDB } from "@/lib/mongodb";
import Token from "@/app/api/models/Token";

const serviceAccount = JSON.parse(process.env.FCM_SERVICE_ACCOUNT_JSON);

const SCOPES = ["https://www.googleapis.com/auth/firebase.messaging"];

async function getAccessToken() {
  const client = new google.auth.JWT(
    serviceAccount.client_email,
    null,
    serviceAccount.private_key,
    SCOPES
  );

  const token = await client.authorize();
  return token.access_token;
}

// -------- SEND NOTIFICATION USING FCM v1 ------------
async function sendMessage(token, payload) {
  const accessToken = await getAccessToken();

  const projectId = serviceAccount.project_id;

  const res = await fetch(
    `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          token,
          notification: {
            title: payload.title,
            body: payload.body,
          },
          data: payload.data,
        },
      }),
    }
  );

  return await res.json();
}

// ---------------- MAIN POST -----------------
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, body: message, data } = body;

    await connectToDB();
    const tokens = await Token.find().select("token -_id");

    const allTokens = tokens.map((t) => t.token).filter(Boolean);

    let successCount = 0;

    for (const token of allTokens) {
      const result = await sendMessage(token, {
        title,
        body: message,
        data: data || {},
      });

      if (result.name !== "error") successCount++;
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent: successCount,
        total: allTokens.length,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("SEND NOTIFICATION ERROR:", err);
    return new Response(
      JSON.stringify({ error: "FCM v1 send failed" }),
      { status: 500 }
    );
  }
}
