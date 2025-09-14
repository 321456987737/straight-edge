// app/api/barber/[id]/customers/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Appointment from "@/model/appointment";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const { searchParams } = new URL(req.url);
    const skip = parseInt(searchParams.get('skip')) || 0;
    const limit = parseInt(searchParams.get('limit')) || 1;

    // Get all appointments for this barber
    const appointments = await Appointment.find({ barberId: id })
      .populate("customerId")
      .sort({ date: -1 });

    // Group by customer and count appointments
    const customerMap = new Map();
    
    appointments.forEach(appt => {
      if (!appt.customerId) return;
      
      const customerId = appt.customerId._id.toString();
      if (customerMap.has(customerId)) {
        const customerData = customerMap.get(customerId);
        customerData.appointmentCount += 1;
        if (new Date(appt.date) > new Date(customerData.lastBooking)) {
          customerData.lastBooking = appt.date;
        }
        if (new Date(appt.date) < new Date(customerData.firstBooking)) {
          customerData.firstBooking = appt.date;
        }
      } else {
        customerMap.set(customerId, {
          ...appt.customerId.toObject(),
          appointmentCount: 1,
          lastBooking: appt.date,
          firstBooking: appt.date
        });
      }
    });
    
    const customers = Array.from(customerMap.values());
    
    // Apply pagination
    const paginatedCustomers = customers.slice(skip, skip + limit);
    const hasMore = skip + limit < customers.length;
    
    return NextResponse.json({ 
      customers: paginatedCustomers,
      hasMore,
      total: customers.length
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
// // app/api/barber/[id]/customers/route.js
// import { NextResponse } from "next/server";
// import { dbConnect } from "@/lib/db";
// import Appointment from "@/model/appointment";

// export async function GET(req, { params }) {
//   try {
//     await dbConnect();
//     const { id } = await params;
    
//     const { searchParams } = new URL(req.url);
//     const skip = parseInt(searchParams.get('skip')) || 0;
//     const limit = parseInt(searchParams.get('limit')) || 10;

//     // Get all appointments for this barber
//     const appointments = await Appointment.find({ barberId: id })
//       .populate("customerId")
//       .sort({ date: -1 })
//       .skip(skip)
//       .limit(limit);

//     // Group by customer and count appointments
//     const customerMap = new Map();
    
//     appointments.forEach(appt => {
//       if (!appt.customerId) return;
      
//       const customerId = appt.customerId._id.toString();
//       if (customerMap.has(customerId)) {
//         const customerData = customerMap.get(customerId);
//         customerData.appointmentCount += 1;
//         if (new Date(appt.date) > new Date(customerData.lastBooking)) {
//           customerData.lastBooking = appt.date;
//         }
//       } else {
//         customerMap.set(customerId, {
//           ...appt.customerId.toObject(),
//           appointmentCount: 1,
//           lastBooking: appt.date
//         });
//       }
//     });
    
//     const customers = Array.from(customerMap.values());
    
//     return NextResponse.json({ customers });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       { error: "Internal Server Error", success: false },
//       { status: 500 }
//     );
//   }
// }