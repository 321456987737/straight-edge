import { dbConnect } from "@/lib/db";
import { NextResponse } from "next/server";
import customer from "@/model/customer";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export async function GET(req) {
  try {
    // ✅ Connect to DB
    try {
      await dbConnect();
    } catch (err) {
      return NextResponse.json(
        { message: "DB connection failed", success: false },
        { status: 500 }
      );
    }

    // ✅ Extract filter param
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

    // ✅ Run aggregation
    const customersData = await customer.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: groupStage,
          customers: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // ✅ Format response for charts
    const formattedData = customersData.map((item) => ({
      date: item._id,
      customers: item.customers,
    }));

    return NextResponse.json({ customersData: formattedData, success: true });
  } catch (err) {
    console.error("Error fetching customers data:", err);
    return NextResponse.json(
      { message: "Server error", success: false },
      { status: 500 }
    );
  }
}
