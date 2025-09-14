import { NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db'
import barber from '@/model/barber'

export async function POST(request, { params }) {
  try {
    await dbConnect()
    const body = await request.json()
    const {id} = await params
    const Barber = await barber.findById(id)

    if (!Barber) {
      return NextResponse.json({ error: 'Barber not found' }, { status: 404 })
    }
    
    Barber.services.push(body)
    await Barber.save()

    return NextResponse.json({ barber:Barber },{status:200})
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}