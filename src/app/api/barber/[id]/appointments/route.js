import appointment from "@/model/appointment";
import { dbConnect } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    
    const skip = parseInt(searchParams.get("skip")) || 0;
    const limit = parseInt(searchParams.get("limit")) || 5;
    const status = searchParams.get("status") || "upcoming";
    
    const now = new Date();
    let query = { barberId: id };

    if (status === "upcoming") {
      query.date = { $gte: now };
      query.status = { $ne: "cancelled" };
    } else if (status === "past") {
      query.date = { $lt: now };
      query.status = { $ne: "cancelled" };
    } else if (status === "cancelled" || status === "completed") {
      query.status = status;
    }

    // Get appointments with proper pagination
    const appointments = await appointment
      .find(query)
      .sort({ date: -1, time: -1 })
      .skip(skip)
      .limit(limit)
      .populate("customerId", "username email image")
      .lean();
    
    // Get total count for statistics
    const totalCount = await appointment.countDocuments(query);
    
    return NextResponse.json({ appointments, totalCount });
  } catch (error) {
    console.error("Error in appointments API:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }

}

export async function PATCH(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { appointmentId, status } = await req.json();
console.log(appointmentId, id , status)
    // Verify the appointment belongs to this barber
    const appointments = await appointment.findOne({
      _id: appointmentId,
      barberId: id
    });

    if (!appointments) {
      return NextResponse.json(
        { message: "appointments not found" },
        { status: 404 }
      );
    }

    // Update the status
    appointments.status = status;
    await appointments.save();

    return NextResponse.json({ message: "Appointment updated successfully" });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}


// import appointment from "@/model/appointment";
// import { dbConnect } from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function GET(req, { params }) {
//   try {
//     await dbConnect();
//     const { id } = await params;
//     const { searchParams } = new URL(req.url);
    
//     const skip = parseInt(searchParams.get("skip")) || 0;
//     const limit = parseInt(searchParams.get("limit")) || 5;
    
//     // Get appointments with proper pagination
//     const appointments = await appointment
//       .find({ barberId: id })
//       .sort({ date: -1, time: -1 })
//       .skip(skip)
//       .limit(1)
//       .populate("customerId", "username email")
//       .lean();
    
//     console.log(`Fetched ${appointments.length} appointments for barber ${id}, skip: ${skip}, limit: ${limit}`);
    
//     return NextResponse.json({ appointments });
//   } catch (error) {
//     console.error("Error in appointments API:", error);
//     return NextResponse.json(
//       { message: "Server error", error: error.message },
//       { status: 500 }
//     );
//   }
// }