import { dbConnect } from "@/lib/db";
import barber from "@/model/barber";
import { NextResponse } from "next/server";
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const Barber = await barber.findById(id).lean();

    if (!Barber) {
      return new Response(JSON.stringify({ message: "Barber not found" }), { status: 404 });
    }
    console.log(Barber);
    return NextResponse.json({Barber:Barber,success: true ,"message": "Barber found"}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
