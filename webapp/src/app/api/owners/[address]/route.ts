import { NextResponse } from "next/server";
import { Owner, addOwner, getOwners, getOwnersById } from "../../database";

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  return NextResponse.json({
    owners: await getOwnersById(params.address),
  });
}
