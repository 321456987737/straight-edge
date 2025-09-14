import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Barber from "@/model/barber";
import Appointment from "@/model/appointment";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 5;
    const skip = (page - 1) * limit;

    // Find barber
    const barbers = await Barber.findById(id).lean();
    if (!barbers) {
      return NextResponse.json({ message: "No barbers found" }, { status: 404 });
    }

    // Count all appointments
    const totalAppointments = await Appointment.countDocuments({ barberId: id });

    // Paginated appointments
    const appointments = await Appointment.find({ barberId: id })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Stats
    const completedAppointments = await Appointment.find({ barberId: id, status: "completed" }).lean();
    const totalSales = completedAppointments.reduce((acc, a) => {
      const totalServicePrice = a.services?.reduce((sum, s) => sum + (s.price || 0), 0) || 0;
      return acc + totalServicePrice;
    }, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todayAppointments = await Appointment.countDocuments({
      barberId: id,
      date: { $gte: today, $lt: tomorrow },
    });

    const avgRating = barbers.rating || 0;

    return NextResponse.json(
      {
        barbers,
        appointments,
        totalAppointments,
        page,
        totalPages: Math.ceil(totalAppointments / limit),
        stats: {
          totalSales,
          totalAppointments,
          todayAppointments,
          avgRating,
        },
        success: true,
        message: "Barber dashboard data fetched",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


// import { NextResponse } from "next/server";
// import { dbConnect } from "@/lib/db";
// import barber from "@/model/barber";
// import appointment from "@/model/appointment";

// export async function GET(req, { params }) {
//   try {
//     await dbConnect();
//     const { id } =await params;

//     // Find barber
//     const barbers = await barber.findById(id).lean();
//     if (!barbers) {
//       return NextResponse.json(
//         { message: "No barber found" },
//         { status: 404 }
//       );
//     }

//     // Find all appointments for this barber
//     const appointments = await appointment
//       .find({ barberId: id })
//       .populate("customerId", "username email") // if you have customer schema
//       .lean();

//     // Date handling
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const tomorrow = new Date(today);
//     tomorrow.setDate(today.getDate() + 1);

//     const dayAfterTomorrow = new Date(tomorrow);
//     dayAfterTomorrow.setDate(tomorrow.getDate() + 1);

//     // Filters
//     const todaysAppointments = appointments.filter(
//       (appt) => appt.date >= today && appt.date < tomorrow
//     );

//     const tomorrowsAppointments = appointments.filter(
//       (appt) => appt.date >= tomorrow && appt.date < dayAfterTomorrow
//     );

//     // Total Earnings
//     let totalEarnings = 0;
//     for (const appt of appointments) {
//       if (appt.status === "completed" && appt.services?.length > 0) {
//         for (const service of appt.services) {
//           const matchedService = appt.services.find(
//             (s) => s._id.toString() === service._id.toString()
//           );
//           if (matchedService) {
//             totalEarnings += matchedService.price;
//           }
//         }
//       }
//     }

//     // Average Rating (placeholder, use reviews later)
//     const averageRating = barbers.rating || 0;

//     // Format all appointments
//     const formattedAppointments = appointments.map((appt) => ({
//       date: appt.date,
//       time: appt.time,
//       customer: appt.customerId?.username || "Unknown",
//       service: appt.services?.map((s) => s.name).join(", ") || "N/A",
//       status: appt.status,
//     }));

//     return NextResponse.json(
//       {
//         success: true,
//         barber: {
//           id: barbers._id,
//           username: barbers.username,
//           email: barbers.email,
//           city: barbers.city,
//           province: barbers.province,
//         },
//         stats: {
//           totalAppointments: appointments.length,
//           appointmentsToday: todaysAppointments.length,
//           appointmentsTomorrow: tomorrowsAppointments.length,
//           totalEarnings,
//           averageRating,
//         },
//         appointments: formattedAppointments,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Dashboard API Error:", error);
//     return NextResponse.json(
//       { message: "Server error" },
//       { status: 500 }
//     );
//   }
// }
