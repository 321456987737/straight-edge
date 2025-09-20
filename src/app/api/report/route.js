import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db"; // adjust path if needed
import completereport from "@/model/completereport";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    const { username, email, report, customerId } = body;

    if (!report || report.trim() === "") {
      return NextResponse.json({ error: "Report is required" }, { status: 400 });
    }
    console.log(username, email, report, customerId);
    const newReport = await completereport.create({
      username,
      email,
      report,
      customerId,
    });

    return NextResponse.json(
      { message: "Report submitted successfully", report: newReport },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
