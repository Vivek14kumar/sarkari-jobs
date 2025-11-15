// app/api/getStats/route.js
import { connectToDB } from '@/lib/mongodb';
import Token from '@/models/Token';


export async function GET() {
try {
await connectToDB();
const count = await Token.countDocuments();
const latest = await Token.find().sort({ createdAt: -1 }).limit(20).select('token createdAt -_id');
return new Response(JSON.stringify({ count, latest }), { status: 200 });
} catch (err) {
console.error(err);
return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
}
}