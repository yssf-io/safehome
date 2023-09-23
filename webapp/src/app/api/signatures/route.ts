import { NextResponse } from "next/server";
import {
  Owner,
  Signature,
  addOwner,
  addSignature,
  deleteSignature,
  getOwners,
  getOwnersById,
} from "../database";

export async function GET() {
  return NextResponse.json({
    signatures: "Not authorized",
  });
}

export async function POST(request: Request) {
  const signature = (await request.json()) as Signature;

  return NextResponse.json({ signature: await addSignature(signature) });
}

export async function DELETE(request: Request) {
  const signature = (await request.json()) as Signature;

  return NextResponse.json({ signature: await deleteSignature(signature) });
}
