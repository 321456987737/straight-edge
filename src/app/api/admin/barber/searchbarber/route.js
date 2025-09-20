import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import barber from "@/model/barber"; // your mongoose model

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const limit = parseInt(searchParams.get("limit")) || 12;

    const barbers = await barber.find({
      $or: [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    })
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, barbers });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch barbers" },
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
         const deletedbarber = await barber.findByIdAndDelete(id);
         if (!deletedbarber) {
            return NextResponse.json({
               success: false,
               error: "barber not found",
            },
            { status: 404 }
            );
         }
         return NextResponse.json({
            success: true,
            message: "barber deleted successfully",
         },
         { status: 200 }
         );
   } catch (error) {
      return NextResponse.json({
         success: false,
         error: "Failed to delete barber",
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
         const user = await barber.findById(id);
         if (user.restricted) {
                  user.restricted = false;
         await user.save();

         return NextResponse.json({
            success: true,
            message: "barber un-restricted successfully",
         },
         { status: 200 }
         );
         }
         user.restricted = true;
         await user.save();

         return NextResponse.json({
            success: true,
            message: "barber restricted successfully",
         },
         { status: 200 }
         );
   } catch (error) {
      return NextResponse.json({
         success: false,
         error: "Failed to restrict barber",
      },
      { status: 500 }
      );
   }
}