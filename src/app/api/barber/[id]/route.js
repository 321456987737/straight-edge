import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import barber from '@/model/barber';
import bcrypt from 'bcryptjs';
import imageKitConfig from '../../imagekit-auth/route';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const barberData = await barber.findById(id);
    if (!barberData) {
      return NextResponse.json({ error: 'Barber not found' }, { status: 404 });
    }
    return NextResponse.json({ barberData: barberData, success: true }, { status: 200 });
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
    if (body.password && body.password !== existingBarber.password) {
      const salt = await bcrypt.genSalt(10);
      updatedPassword = await bcrypt.hash(body.password, salt);
    }

    const updatedBarberData = {
      username: body.username,
      email: body.email,
      number: body.number,
      location: body.location,
      province: body.province,
      city: body.city,
      services: body.services,
      workinghours: body.workinghours,
      password: updatedPassword,
      image: body.image || existingBarber.image,
      followers: body.followers,
      following: body.following,
    };

    const updatedBarber = await barber.findByIdAndUpdate(
      id, 
      updatedBarberData, 
      { new: true, runValidators: true }
    );

    return NextResponse.json({ barber: updatedBarber, success: true }, { status: 200 });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE endpoint for barber (optional - for complete CRUD)
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const existingBarber = await barber.findById(id);
    if (!existingBarber) {
      return NextResponse.json({ error: 'Barber not found' }, { status: 404 });
    }

    // Delete profile image from ImageKit if exists
    if (existingBarber.image && existingBarber.image.length > 0) {
      try {
        await imageKitConfig.deleteFile(existingBarber.image[0].fileId);
        console.log('Deleted barber image:', existingBarber.image[0].fileId);
      } catch (deleteError) {
        console.warn('Could not delete barber image:', deleteError.message);
      }
    }

    await barber.findByIdAndDelete(id);

    return NextResponse.json({ 
      success: true, 
      message: 'Barber deleted successfully' 
    }, { status: 200 });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



// import { NextResponse } from 'next/server';
// import { dbConnect } from '@/lib/db';
// import barber from '@/model/barber';
// import bcrypt from 'bcryptjs';

// export async function GET(request, { params }) {
//   try {
//     await dbConnect();
//     const { id } = await params;
//     const barberData = await barber.findById(id);
//     if (!barberData) {
//       return NextResponse.json({ error: 'Barber not found' }, { status: 404 });
//     }
//     return NextResponse.json({ barberData: barberData, success: true }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

// export async function PUT(request, { params }) {
//   try {
//     await dbConnect();

//     const body = await request.json();
//     const { id } = await params;

//     const existingBarber = await barber.findById(id);
//     if (!existingBarber) {
//       return NextResponse.json({ error: 'Barber not found' }, { status: 404 });
//     }

//     let updatedPassword = existingBarber.password;
//     if (body.password && body.password !== existingBarber.password) {
//       const salt = await bcrypt.genSalt(10);
//       updatedPassword = await bcrypt.hash(body.password, salt);
//     }

//     const updatedBarberData = {
//       username: body.username,
//       email: body.email,
//       number: body.number,
//       location: body.location,
//       province: body.province,
//       city: body.city,
//       services: body.services,
//       workinghours: body.workinghours,
//       password: updatedPassword,
//       // Update image if provided
//       image: body.image || existingBarber.image,
//       followers: body.followers,
//       following: body.following,
//     };

//     const updatedBarber = await barber.findByIdAndUpdate(
//       id, 
//       updatedBarberData, 
//       { new: true, runValidators: true }
//     );

//     return NextResponse.json({ barber: updatedBarber, success: true }, { status: 200 });
//   } catch (error) {
//     console.error('Update error:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }
















// import { NextResponse } from 'next/server';
// import { dbConnect } from '@/lib/db';
// import barber from '@/model/barber';
// import bcrypt from 'bcryptjs';
// export async function GET(request, { params }) {
//   try {
//     await dbConnect();
//     const { id } = await params;
//     const barberData = await barber.findById(id);
//     if (!barberData) {
//       return NextResponse.json({ error: 'Barber not found' }, { status: 404 });
//     }
//     return NextResponse.json({barberData:barberData,success: true }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

// export async function PUT(request, { params }) {
//   try {
//     await dbConnect();

//     const body = await request.json();
//     const { id } = await params;

//     const existingBarber = await barber.findById(id);
//     if (!existingBarber) {
//       return NextResponse.json({ error: 'Barber not found' }, { status: 404 });
//     }

//     let updatedPassword = existingBarber.password;
//     if (body.password) {
//       const salt = await bcrypt.genSalt(10);
//       updatedPassword = await bcrypt.hash(body.password, salt);
//     }

//     const updatedBarberData = {
//       username: body.username,
//       email: body.email,
//       number: body.number,
//       location: body.location,
//       services: body.services,
//       workinghours: body.workinghours,
//       password: updatedPassword
//     };

//     const updatedBarber = await barber.findByIdAndUpdate(
//       id, 
//       updatedBarberData, 
//       { new: true, runValidators: true }
//     );

//     return NextResponse.json({ barber: updatedBarber, success: true }, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }
