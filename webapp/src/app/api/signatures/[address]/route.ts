import { NextResponse } from "next/server";
import { getSignaturesBySafe } from "../../database";

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  return NextResponse.json({
    signatures: await getSignaturesBySafe(params.address),
  });
}
