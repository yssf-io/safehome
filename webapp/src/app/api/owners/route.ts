import { NextResponse } from "next/server";
import { Owner, addOwner, getOwners, getOwnersById } from "../database";

export async function GET() {
  return NextResponse.json({
    owners: await getOwners(),
  });
}

export async function POST(request: Request) {
  const owner = (await request.json()) as Owner;

  return NextResponse.json({ owner: await addOwner(owner) });
}
