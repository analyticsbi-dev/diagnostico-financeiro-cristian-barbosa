import { NextResponse } from "next/server";
export async function POST(request: Request) { const response = NextResponse.redirect(new URL("/", request.url), 303); response.cookies.set("kohi_session", "", { httpOnly:true, sameSite:"strict", maxAge:0, path:"/" }); return response; }
