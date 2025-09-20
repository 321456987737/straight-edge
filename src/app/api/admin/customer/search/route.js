import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import customer from "@/model/customer"; // your mongoose model

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit")) || 12;

    const customers = await customer.find({
      $or: [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, customers });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
export async function DELETE (req){
   try {
      await dbConnect();
          const { searchParams } = new URL(req.url);
         const id = searchParams.get("id");
         console.log(id,"this is the id ")
         const deletedCustomer = await customer.findByIdAndDelete(id);
         if (!deletedCustomer) {
            return NextResponse.json({
               success: false,
               error: "Customer not found",
            },
            { status: 404 }
            );
         }
         return NextResponse.json({
            success: true,
            message: "Customer deleted successfully",
         },
         { status: 200 }
         );
   } catch (error) {
      return NextResponse.json({
         success: false,
         error: "Failed to delete customer",
      },
      { status: 500 }
      );
   }
}
export async function PUT (req){
   try {
      await dbConnect();
          const { searchParams } = new URL(req.url);
         const id = searchParams.get("id");
         console.log(id,"this is the id olaoalaoallallala")
         const user = await customer.findById(id);
         if (user.restricted) {
                  user.restricted = false;
         await user.save();

         return NextResponse.json({
            success: true,
            message: "Customer un-restricted successfully",
         },
         { status: 200 }
         );
         }
         user.restricted = true;
         await user.save();

         return NextResponse.json({
            success: true,
            message: "Customer restricted successfully",
         },
         { status: 200 }
         );
   } catch (error) {
      return NextResponse.json({
         success: false,
         error: "Failed to restrict customer",
      },
      { status: 500 }
      );
   }
}