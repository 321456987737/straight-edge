import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import barber from "@/model/barber";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 5;

    const total = await barber.countDocuments();
    const barbers = await barber.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      barbers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch barbers" },
      { status: 500 }
    );
  }
}
