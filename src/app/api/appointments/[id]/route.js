import { dbConnect } from "@/lib/db";
import Appointment from "@/model/appointment";
import { NextResponse } from "next/server";

// GET all appointments for a customer
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    console.log(id, "Customer ID");

    const appointments = await Appointment.find({ customerId: id })
      .populate('barberId', 'username email number city province')
      .lean();

    if (!appointments || appointments.length === 0) {
      return NextResponse.json(
        { message: "No appointments found" }, 
        { status: 200 }
      );
    }

    return NextResponse.json(
      { 
        appointments: appointments, 
        success: true, 
        message: "Appointments found" 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" }, 
      { status: 500 }
    );
  }
}

// UPDATE an appointment (reschedule)
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const updateData = await req.json();
    
    console.log(id, "Appointment ID to update");
    console.log(updateData, "Update data");

    // Validate required fields
    if (!updateData.date || !updateData.time) {
      return NextResponse.json(
        { message: "Date and time are required" }, 
        { status: 400 }
      );
    }

    // Check if appointment exists
    const existingAppointment = await Appointment.findById(id);
    if (!existingAppointment) {
      return NextResponse.json(
        { message: "Appointment not found" }, 
        { status: 404 }
      );
    }

    // Check if the new date/time is in the future
    const newDateTime = new Date(`${updateData.date}T${updateData.time}`);
    if (newDateTime <= new Date()) {
      return NextResponse.json(
        { message: "Appointment must be scheduled for a future date and time" }, 
        { status: 400 }
      );
    }

    // Update the appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { 
        date: new Date(updateData.date),
        time: updateData.time,
        status: updateData.status || existingAppointment.status
      },
      { new: true, runValidators: true }
    ).populate('barberId', 'username email number city province');

    if (!updatedAppointment) {
      return NextResponse.json(
        { message: "Failed to update appointment" }, 
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        appointment: updatedAppointment, 
        success: true, 
        message: "Appointment updated successfully" 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" }, 
      { status: 500 }
    );
  }
}

// DELETE (cancel) an appointment
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    console.log(id, "Appointment ID to delete");

    // Check if appointment exists
    const existingAppointment = await Appointment.findById(id);
    if (!existingAppointment) {
      return NextResponse.json(
        { message: "Appointment not found" }, 
        { status: 404 }
      );
    }

    // Check if appointment can be cancelled (e.g., not in the past)
    const appointmentDateTime = new Date(`${existingAppointment.date}T${existingAppointment.time}`);
    if (appointmentDateTime <= new Date()) {
      return NextResponse.json(
        { message: "Cannot cancel past appointments" }, 
        { status: 400 }
      );
    }

    // Delete the appointment
    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return NextResponse.json(
        { message: "Failed to cancel appointment" }, 
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Appointment cancelled successfully" 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Server error" }, 
      { status: 500 }
    );
  }
}
// import { dbConnect } from "@/lib/db";
// import Appointment from "@/model/appointment";
// import { NextResponse } from "next/server";
// export async function GET(req, { params }) {
//   try {
//     await dbConnect();
//     const { id } = await params;
//       console.log(id,"this sit ehid")
//     const appointments = await Appointment.find({ customerId: id }).lean();

//     if (!appointments) {
//       return new Response(JSON.stringify({ message: "No appointments found" }), { status: 404 });
//     }
//     console.log(appointments);
//     return NextResponse.json({ appointments: appointments, success: true, message: "Appointments found" }, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }
