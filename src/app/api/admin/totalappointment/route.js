import appointment from "@/model/appointment";
import { dbConnect } from "@/lib/db";
import { NextResponse } from "next/server";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export async function GET(req) {
  try {
    await dbConnect();

    // Extract filter param from URL
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "thisMonth";

    let matchStage = {};
    let groupStage = {};
    let format = "%Y-%m-%d"; // default daily

    if (filter === "thisMonth") {
      const start = startOfMonth(new Date());
      const end = endOfMonth(new Date());
      matchStage = { createdAt: { $gte: start, $lte: end } };
      groupStage = { $dateToString: { format, date: "$createdAt" } }; // daily
    } else if (filter === "lastMonth") {
      const lastMonthDate = subMonths(new Date(), 1);
      const start = startOfMonth(lastMonthDate);
      const end = endOfMonth(lastMonthDate);
      matchStage = { createdAt: { $gte: start, $lte: end } };
      groupStage = { $dateToString: { format, date: "$createdAt" } }; // daily
    } else if (filter === "last12Months") {
      const lastYearDate = subMonths(new Date(), 12);
      matchStage = { createdAt: { $gte: lastYearDate } };
      groupStage = { $dateToString: { format: "%Y-%m", date: "$createdAt" } }; // monthly
    }

    const appointmentsData = await appointment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupStage,
          appointments: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    console.log(appointmentsData,"this si teh appointment data olalala")
    // format response for chart
    const formattedData = appointmentsData.map((item) => ({
      date: item._id,
      appointments: item.appointments,
    }));

    return NextResponse.json({ appointmentsData: formattedData, success: true });
  } catch (err) {
    console.error("Error fetching appointments data:", err);
    return NextResponse.json(
      { message: "Server error", success: false },
      { status: 500 }
    );
  }
}
