import { NextResponse } from "next/server";
import barber from "@/model/barber";
import { dbConnect } from "@/lib/db";
import report from "@/model/report";
export async function POST(req) {
  try {
    try {
      await dbConnect();
    } catch (err) {
      return NextResponse.json(
        { error: "DB connection failed", success: false },
        { status: 500 }
      );
    }
    console.log(1)
    const body = await req.json();
    const { reports, barberId, userId } = body;
    console.log(reports, barberId, userId)
      const customerId = userId; 
    const newreport = report({
      reports,
      barberId,
      customerId,
    })

    await newreport.save();
     const Barber = await barber.findById(barberId);
    if (!Barber) {
      return NextResponse.json(
        { error: "Barber not found", success: false },
        { status: 404 }
      );
    }

    Barber.reports = (Barber.reports || 0) + 1; // increment number
    console.log(Barber,"barber here")
    await Barber.save();

   return NextResponse.json({
      message: "Report added successfully",
      success: true,
    })
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
