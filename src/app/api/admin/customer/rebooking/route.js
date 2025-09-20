import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Appointment from "@/model/appointment";

export async function GET() {
  try {
    await dbConnect();

    // ✅ Get all appointments and populate customer details
    const appointments = await Appointment.find()
      .populate("customerId", "name email") // only fetch name & email from user
      .lean();

    // Map to store { customerId: { visits, customer } }
    const customerMap = new Map();

    appointments.forEach((appt) => {
      const customer = appt.customerId;
      if (!customer?._id) return;

      const customerId = customer._id.toString();
      if (!customerMap.has(customerId)) {
        customerMap.set(customerId, { visits: 0, customer });
      }

      customerMap.get(customerId).visits += 1;
    });

    let newCustomers = [];
    let returningCustomers = [];

    customerMap.forEach(({ visits, customer }) => {
      if (visits === 1) {
        newCustomers.push(customer);
      } else {
        returningCustomers.push(customer);
      }
    });

    return NextResponse.json({
      chart: [
        { name: "New Customers", value: newCustomers.length },
        { name: "Returning Customers", value: returningCustomers.length },
      ],
      users: {
        new: newCustomers,
        returning: returningCustomers,
      },
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch customer rebooking data" },
      { status: 500 }
    );
  }
}
