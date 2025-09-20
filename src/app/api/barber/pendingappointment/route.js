import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import appointment from "@/model/appointment";

export async function GET(request) {
  try {
    // Ensure DB connection
    try {
      await dbConnect();
    } catch (err) {
      console.error("DB connection failed:", err);
      return NextResponse.json(
        { success: false, error: "Database connection failed" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const skip = Math.max(parseInt(searchParams.get("skip") || "0", 10), 0);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "8", 10), 1),
      50
    );

    // ✅ Current time
    const now = new Date();

    // ✅ Only non-completed appointments created at/after now
    const query = {
      status: "pending",
      createdAt: { $gte: now },
    };

    // ✅ Count
    const total = await appointment.countDocuments(query);

    // ✅ Fetch data
    const appointments = await appointment
      .find(query)
      .sort({ createdAt: -1 }) // latest created first
      .skip(skip)
      .limit(limit)
      .populate("customerId", "username email image")
      .populate("barberId", "username email city province rating")
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: appointments,
        pagination: {
          total,
          page: Math.floor(skip / limit) + 1,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { success: false, error: "Server error, please try again later" },
      { status: 500 }
    );
  }
}
