import { dbConnect } from "@/lib/db";
import { NextResponse } from "next/server";
import Appointment from "@/model/appointment"; // adjust to your actual model path
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "thisMonth";

    let matchStage = { status: "completed" }; // ✅ only completed
    let groupStage = {};
    let format = "%Y-%m-%d"; // daily by default

    if (filter === "thisMonth") {
      const start = startOfMonth(new Date());
      const end = endOfMonth(new Date());
      matchStage.date = { $gte: start, $lte: end }; // ✅ use appointment date
      groupStage = { $dateToString: { format, date: "$date" } };
    } else if (filter === "lastMonth") {
      const lastMonthDate = subMonths(new Date(), 1);
      const start = startOfMonth(lastMonthDate);
      const end = endOfMonth(lastMonthDate);
      matchStage.date = { $gte: start, $lte: end };
      groupStage = { $dateToString: { format, date: "$date" } };
    } else if (filter === "last12Months") {
      const lastYearDate = subMonths(new Date(), 12);
      matchStage.date = { $gte: lastYearDate };
      groupStage = { $dateToString: { format: "%Y-%m", date: "$date" } }; // monthly
    }

    const salesData = await Appointment.aggregate([
      { $match: matchStage },
      {
        $addFields: {
          totalPrice: { $sum: "$services.price" }, // ✅ sum service prices
        },
      },
      {
        $group: {
          _id: groupStage,
          sales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formattedData = salesData.map((item) => ({
      date: item._id,
      sales: item.sales,
    }));

    return NextResponse.json({ salesData: formattedData, success: true });
  } catch (err) {
    console.error("Error fetching sales data:", err);
    return NextResponse.json(
      { message: "Server error", success: false },
      { status: 500 }
    );
  }
}
