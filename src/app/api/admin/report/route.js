import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import completereport from "@/model/completereport";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 5;

    const total = await completereport.countDocuments();
    const reports = await completereport.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      reports,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
