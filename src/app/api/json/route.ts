import { NextResponse, NextRequest } from "next/server";
import { pinata } from "../../../../utils/config";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET() {}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        "Content-Type": "application/json",
      },
    };

    const res = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      options
    )
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));

    return NextResponse.json(res);
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
