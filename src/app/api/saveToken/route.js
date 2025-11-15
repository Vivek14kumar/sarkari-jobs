// app/api/saveToken/route.js
import { connectToDB } from '@/lib/mongodb';
import Token from '@/app/api/models/Token';


export async function POST(req) {
try {
const { token } = await req.json();
if (!token) return new Response(JSON.stringify({ error: 'Missing token' }), { status: 400 });


await connectToDB();
const exists = await Token.findOne({ token });
if (!exists) await Token.create({ token });


return new Response(JSON.stringify({ success: true }), { status: 200 });
} catch (err) {
console.error(err);
return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
}
}