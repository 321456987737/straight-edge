import appointment from "@/model/appointment";
import barber from "@/model/barber";
import customer from "@/model/customer";
import { dbConnect } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Connect to DB
    try {
      await dbConnect();
    } catch (err) {
      console.error("DB connection failed:", err);
      return NextResponse.json(
        { message: "db connection failed", success: false },
        { status: 500 }
      );
    }

    // ✅ use countDocuments instead of count
    const appointments = await appointment.countDocuments();
    const barbers = await barber.countDocuments();
    const customers = await customer.countDocuments();
    const completedAppointment = await appointment.countDocuments({
      status: "completed",
    });

    const totals = {
      appointments,
      barbers,
      customers,
      completedAppointment,
    };

    return NextResponse.json({ totals, success: true }, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { message: "Server error", success: false },
      { status: 500 }
    );
  }
}
