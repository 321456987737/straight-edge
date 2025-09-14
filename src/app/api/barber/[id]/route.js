import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import barber from '@/model/barber';
import bcrypt from 'bcryptjs';
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const barberData = await barber.findById(id);
    if (!barberData) {
      return NextResponse.json({ error: 'Barber not found' }, { status: 404 });
    }
    return NextResponse.json({barberData,success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const body = await request.json();
    const { id } = await params;

    const existingBarber = await barber.findById(id);
    if (!existingBarber) {
      return NextResponse.json({ error: 'Barber not found' }, { status: 404 });
    }

    let updatedPassword = existingBarber.password;
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      updatedPassword = await bcrypt.hash(body.password, salt);
    }

    const updatedBarberData = {
      username: body.username,
      email: body.email,
      number: body.number,
      location: body.location,
      services: body.services,
      workinghours: body.workinghours,
      password: updatedPassword
    };

    const updatedBarber = await barber.findByIdAndUpdate(
      id, 
      updatedBarberData, 
      { new: true, runValidators: true }
    );

    return NextResponse.json({ barber: updatedBarber, success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
