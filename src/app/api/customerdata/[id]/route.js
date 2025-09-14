import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import customer from "@/model/customer";
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const customerData = await customer.findById(id);
    if (!customerData) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { customerData: customerData, success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
