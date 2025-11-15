// app/api/sendNotification/route.js
import { connectToDB } from '@/lib/mongodb';
import Token from '@/models/Token';


const FCM_URL = 'https://fcm.googleapis.com/fcm/send';
const SERVER_KEY = process.env.FCM_SERVER_KEY;


async function sendBatch(tokens, payload) {
const body = {
registration_ids: tokens,
notification: {
title: payload.title,
body: payload.body,
click_action: payload.click_action || '/',
icon: payload.icon || '/icons/icon-192.png',
},
data: payload.data || {},
};


const res = await fetch(FCM_URL, {
method: 'POST',
headers: {
Authorization: `key=${SERVER_KEY}`,
'Content-Type': 'application/json',
},
body: JSON.stringify(body),
});
return res.json();
}


export async function POST(req) {
if (!SERVER_KEY) return new Response(JSON.stringify({ error: 'FCM_SERVER_KEY missing' }), { status: 500 });


// TODO: Protect this route with admin authentication
try {
const body = await req.json();
const title = body.title || 'New Job Alert';
const message = body.body || 'New vacancy on resultshub.in';
const click_action = body.click_action || 'https://resultshub.in';
const data = body.data || {};


await connectToDB();
const tokens = await Token.find().select('token -_id');
const allTokens = tokens.map(t => t.token).filter(Boolean);


if (allTokens.length === 0) return new Response(JSON.stringify({ success: true, sent: 0 }), { status: 200 });


const batches = [];
for (let i = 0; i < allTokens.length; i += 1000) batches.push(allTokens.slice(i, i + 1000));


const results = [];
for (const b of batches) results.push(await sendBatch(b, { title, body: message, click_action, data }));


// Optional: parse results to remove invalid tokens (TODO)


return new Response(JSON.stringify({ success: true, batches: results.length }), { status: 200 });
} catch (err) {
console.error(err);
return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
}
}