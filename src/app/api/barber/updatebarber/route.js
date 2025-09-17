import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import barber from "@/model/barber";
export async function PUT(req) {
  console.log(1);
  try {
    try {
      await dbConnect();
    } catch (err) {
      return NextResponse.json(
        { error: "DB connection failed", success: false },
        { status: 500 }
      );
    }
    const body = await req.json();
    const { review, rating, barberId, userId } = body;
    const Barber = await barber.findById(barberId);


    if (!Barber) {
      return NextResponse.json(
        { error: "Barber not found", success: false },
        { status: 404 }
      );
    }
    Barber.reviews.push({ user: userId, comment: review });
    Barber.ratings.push({ user: userId, rating });


    await Barber.save();
    return NextResponse.json(
      { barber: Barber, message: "Review added successfully", success: true },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
