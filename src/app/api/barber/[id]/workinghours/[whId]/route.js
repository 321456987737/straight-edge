import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import barber from '@/model/barber'

export async function DELETE(request, { params }) {
  try {
    await dbConnect()
   const { whId } = await params
   const { id } = await params
    const Barber = await barber.findById(id)

    if (!Barber) {
      return NextResponse.json({ error: 'Barber not found' }, { status: 404 })
    }

    Barber.workinghours = Barber.workinghours.filter(
      wh => wh._id.toString() !== whId
    )

    await Barber.save()

    return NextResponse.json(Barber)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}