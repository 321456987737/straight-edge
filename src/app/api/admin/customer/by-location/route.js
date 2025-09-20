import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Customer from "@/model/customer"; // adjust path if needed

export async function GET() {
  try {
    await dbConnect();

    // Group customers by city/area
    const result = await Customer.aggregate([
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
    console.error("Error fetching customers by location:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
