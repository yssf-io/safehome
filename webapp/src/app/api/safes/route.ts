import { NextResponse } from "next/server";
import {
  Owner,
  Safe,
  addOwner,
  addSafe,
  getOwners,
  getOwnersById,
  getSafes,
} from "../database";

export async function GET() {
  return NextResponse.json({
    safes: await getSafes(),
  });
}

export async function POST(request: Request) {
  const safe = (await request.json()) as Safe;

  return NextResponse.json({ safe: await addSafe(safe) });
}
