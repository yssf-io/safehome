import { NextResponse } from "next/server";
import {
  Owner,
  addOwner,
  getOwners,
  getOwnersById,
  getOwnersBySafe,
} from "../../database";

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  return NextResponse.json({
    owners: await getOwnersBySafe(params.address),
  });
}
