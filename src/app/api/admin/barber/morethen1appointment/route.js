import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Appointment from "@/model/appointment";

export async function GET() {
  try {
    await dbConnect();

    // ✅ Get all appointments and populate barber details
    const appointments = await Appointment.find()
      .populate("barberId", "username email") // only fetch barber name & email
      .lean();

    // Map to store { barberId: { count, barber } }
    const barberMap = new Map();

    appointments.forEach((appt) => {
      const barber = appt.barberId;
      if (!barber?._id) return;

      const barberId = barber._id.toString();
      if (!barberMap.has(barberId)) {
        barberMap.set(barberId, { count: 0, barber });
      }

      barberMap.get(barberId).count += 1;
    });

    let tenPlusBarbers = [];
    let lessTenBarbers = [];

    barberMap.forEach(({ count, barber }) => {
      if (count >= 10) {
        tenPlusBarbers.push({ ...barber, totalAppointments: count });
      } else {
        lessTenBarbers.push({ ...barber, totalAppointments: count });
      }
    });

    console.log(barberMap,"barber map")

    return NextResponse.json({
      chart: [
        { name: "10+ Appointments", value: tenPlusBarbers.length },
        { name: "<10 Appointments", value: lessTenBarbers.length },
      ],
      barbers: {
        tenPlus: tenPlusBarbers,
        lessTen: lessTenBarbers,
      },
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch barber performance data" },
      { status: 500 }
    );
  }
}
