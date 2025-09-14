import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import customer from "@/model/customer";
export async function POST(request) {
try{
   const data = await request.json();
   console.log(data,"this is the data ")
   console.log("API /customer/signup called");
   await dbConnect();
     const newCustomer = new customer(data);
   await newCustomer.save();
   
   return NextResponse.json({ message: "Signup successful", success: true }, { status: 200 });
}catch(err){
   console.error("Error occurred during signup:", err);
   return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
}