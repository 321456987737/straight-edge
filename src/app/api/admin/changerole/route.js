import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db"; // adjust path if needed
import Customer from "@/model/customer"; // your customer schema

// ✅ Change role
export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id, role } = body;

    if (!id || !role) {
      return NextResponse.json({ error: "ID and role are required" }, { status: 400 });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );

    if (!updatedCustomer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Role updated successfully",
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error("Role change failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
