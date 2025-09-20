import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import barber from "@/model/barber"; // adjust path if needed

export async function GET() {
  try {
    await dbConnect();

    // Group barbers by city/area
    const result = await barber.aggregate([
      {
        $group: {
          _id: "$city", // or "$area" depending on your schema
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } }, // Top areas first
      { $limit: 10 }, // Top 10 cities/areas
    ]);

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (err) {
    console.error("Error fetching barbers by location:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
