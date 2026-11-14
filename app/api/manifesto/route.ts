import { env } from "cloudflare:workers";
import {BANK_SIZE,clauseAt} from "../../../lib/manifesto-bank";
export const dynamic = "force-dynamic";
function response(data:unknown,status=200){return Response.json(data,{status,headers:{"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}})}
export async function GET(req:Request){try{const before=Number(new URL(req.url).searchParams.get("before"))||2147483647;const db=env.DB!;const rows=await db.prepare("SELECT id, body, created_at, display_name FROM clauses WHERE id < ? ORDER BY id DESC LIMIT 20").bind(before).all();const count=await db.prepare("SELECT COUNT(*) AS total FROM clauses").first();return response({rows:rows.results,total:count?.total||0});}catch{return response({error:"The council’s archive is temporarily unavailable. Please try again."},503)}}
export async function POST(req:Request){
const origin=req.headers.get("origin");if(origin&&origin!==new URL(req.url).origin)return response({error:"Please generate from the manifesto page or a direct agent request."},403);
if(Number(req.headers.get("content-length"))>2048)return response({error:"A manifesto request must fit in 2 KB."},413);
try{const raw=await req.text();if(raw.length>2048)return response({error:"Request too large."},413);let data:{direction?:string;visitor?:string;name?:string}={};try{data=raw?JSON.parse(raw):{}}catch{return response({error:"Send a JSON object."},400)}
if(data===null||typeof data!=="object"||Array.isArray(data))return response({error:"Send a JSON object."},400);
if(typeof data.direction!=="undefined"&&(typeof data.direction!=="string"||data.direction.length>200))return response({error:"Creative direction must be text, at most 200 characters."},400);
const cookie=req.headers.get("cookie")?.match(/(?:^|; )slop_visitor=([a-f0-9-]{36})(?:;|$)/)?.[1];
const visitor=cookie||(typeof data.visitor==="string"&&/^[a-f0-9-]{36}$/.test(data.visitor)?data.visitor:crypto.randomUUID());
const ip=req.headers.get("cf-connecting-ip");if(!ip)return response({error:"Network protection is unavailable. Generation is temporarily paused."},503);
const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode("slopmanifest:v1:"+ip));const network=Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,"0")).join("");
let name:string|null=null;
if(data.name!==undefined){if(typeof data.name!=="string")return response({error:"Name must be text."},400);const clean=data.name.normalize("NFKC").trim().replace(/\s+/g," ");if(clean.length>40||!/^[-\p{L}\p{N} ._'’]*$/u.test(clean))return response({error:"Use a short display name (up to 40 characters), without links or symbols."},400);if(/https?|www|fuck|shit|nigger|nigga|faggot|cunt|kike|heil hitler/i.test(clean))return response({error:"Please choose a different display name."},400);name=clean||null}
const now=Math.floor(Date.now()/1000);const index=crypto.getRandomValues(new Uint32Array(1))[0]%BANK_SIZE;const body=clauseAt(index);
const result=await env.DB!.prepare("INSERT INTO clauses (body, created_at, visitor, network, display_name) SELECT ?, ?, ?, ?, ? WHERE (SELECT COUNT(*) FROM clauses) < 10000 AND (SELECT COUNT(*) FROM clauses WHERE visitor = ? OR network = ?) < 3 AND NOT EXISTS (SELECT 1 FROM clauses WHERE created_at > ?) RETURNING id, body, created_at, display_name").bind(body,now,visitor,network,name,visitor,network,now-10).first();
if(!result)return response({error:"Contribution not added: maximum 3 per browser/network, a global 10-second cooldown, and a 10,000-clause archive limit apply."},429);
const r=response({row:result,visitor,mode:"curated-bank",bank_size:BANK_SIZE},201);r.headers.set("Set-Cookie",`slop_visitor=${visitor}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`);return r;
}catch{return response({error:"The clause could not be saved. Please retry."},503)}}
