import { dbConnect } from "@/lib/db";
import barber from "@/model/barber";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const images = body.updateddata; // Should be an array

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "No images provided", success: false }, { status: 400 });
    }
    const updatedBarber = await barber.findByIdAndUpdate(
      id,
      { $push: { portfolio: { $each: images } } },
      { new: true }
    );

    if (!updatedBarber) {
      return NextResponse.json({ error: "Barber not found", success: false }, { status: 404 });
    }
    return NextResponse.json({ portfolio: updatedBarber.portfolio, success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } =await params;               // Barber ID from route
    const { fileId } = await req.json(); // FileId from request body
   console.log(fileId,id)


    // Remove the portfolio entry that has this fileId
    const updatedBarber = await barber.findByIdAndUpdate(
      id,
      { $pull: { portfolio: { fileId } } },  // 👈 pull the matching object
      { new: true }                          // return updated doc
    );

    if (!updatedBarber) {
      return NextResponse.json(
        { error: "Barber not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, portfolio: updatedBarber.portfolio },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const barberData = await barber.findById(id);
    if (!barberData) {
      return NextResponse.json(
        {
          error: "Barber not found",
          success: false,
        },
        {
          status: 404,
        }
      );
    }
    return NextResponse.json(
      {
        portfolio: barberData.portfolio,
        success: true,
      },
      {
        status: 200,
      }
    )
  } catch (err) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
