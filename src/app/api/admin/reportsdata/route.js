import completereport from "@/model/completereport";
import { dbConnect } from "@/lib/db";
import { NextResponse } from "next/server";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export async function GET(req) {
  try {
    try {
      await dbConnect();
    } catch (err) {
      return NextResponse.json(
        { error: "Failed to connect to database", success: false },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter") || "thisMonth";

    let matchStage = {};
    let groupStage = {};
    let format = "%Y-%m-%d"; // default daily

    if (filter === "thisMonth") {
      const start = startOfMonth(new Date());
      const end = endOfMonth(new Date());
      matchStage = { createdAt: { $gte: start, $lte: end } };
      groupStage = { $dateToString: { format, date: "$createdAt" } };
    } else if (filter === "lastMonth") {
      const lastMonthDate = subMonths(new Date(), 1);
      const start = startOfMonth(lastMonthDate);
      const end = endOfMonth(lastMonthDate);
      matchStage = { createdAt: { $gte: start, $lte: end } };
      groupStage = { $dateToString: { format, date: "$createdAt" } };
    } else if (filter === "last12Months") {
      const lastYearDate = subMonths(new Date(), 12);
      matchStage = { createdAt: { $gte: lastYearDate } };
      groupStage = { $dateToString: { format: "%Y-%m", date: "$createdAt" } }; // monthly
    }

    // ✅ Count reports by createdAt
    const reportData = await completereport.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupStage,
          count: { $sum: 1 }, // <-- count reports
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const totalReports = await completereport.countDocuments();

    // ✅ format for chart
    const formattedData = reportData.map((item) => ({
      date: item._id,
      reports: item.count, // match frontend key
    }));

    return NextResponse.json({
      Reports: formattedData,
      TotalReports: totalReports,
      success: true,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch data", success: false },
      { status: 400 }
    );
  }
}
