import { NextRequest , NextResponse} from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { prompt } = body;
    return NextResponse.json({ message: "Hello, world!" });
}