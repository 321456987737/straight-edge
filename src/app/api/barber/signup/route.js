import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import barber from "@/model/barber";
export async function POST(request) {
try{
   const data = await request.json();
   console.log(data,"this is the data ")
   console.log("API /barber/signup called");
   await dbConnect();
   const newBarber = new barber(data);
   await newBarber.save();
   return NextResponse.json({ message: "Signup successful", success: true }, { status: 200 });
}catch(err){
   console.error("Error occurred during signup:", err);
   return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
}