import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Appointment from "@/model/appointment";

export async function POST(request) {
try{  
   dbConnect();
   const { customerId, barberId, services, date, time, barber } = await request.json();
   if (!customerId || !barberId || !services || !date || !time || !barber ) {
     return NextResponse.json({ error: 'Missing required fields', success: false }, { status: 400 });
   }
   const newAppointment = new Appointment({
     customerId,
     barberId,
     barber,
     services,
     date,
     time
   });
   await newAppointment.save();
   return NextResponse.json({ message: 'Appointment created successfully', success: true }, { status: 200 });

}catch(error){
   return NextResponse.json({ error: 'Internal Server Error', success: false }, { status: 500 })
}
}