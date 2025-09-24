// app/api/updateuser/[id]/route.js
import { dbConnect } from '@/lib/db';
import Customer from '@/model/customer';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
import imageKitConfig from "@/app/api/imagekit-auth/route"

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const { username, email, number, province, city, location, password, profilepic } = await req.json();

    // Check if customer exists
    const customer = await Customer.findById(id);
    if (!customer) {
      return NextResponse.json({ status: 404, success: false, message: 'Customer not found' });
    }

    // Store old profile picture for deletion
    const oldProfilePic = customer.profilepic;
    console.log(oldProfilePic,"hi")
    // Prepare update data
    const updateData = { 
      username, 
      email, 
      number, 
      province,
      city,
      location,
    };

    // Only update profilepic if new one is provided
    if (profilepic && profilepic.length > 0) {
      updateData.profilepic = profilepic;
    }

    // Hash password if provided
    if (password) {
      updateData.password = await hash(password, 12);
    }

    // Update customer
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    );
      console.log(1111)
    // Delete old image from ImageKit if profile picture was changed
    if (profilepic && profilepic.length > 0 && oldProfilePic && oldProfilePic.length > 0) {
      const oldFileId = oldProfilePic[0].fileId;
      console.log(oldFileId,"hi xx")
      if (oldFileId) {
        try {
          await imageKitConfig.deleteFile(oldFileId);
          console.log('Old profile picture deleted from Ima geKit');
        } catch (deleteError) { 
          console.error('Error deleting old image from ImageKit:', deleteError);
          // Don't fail the update if deletion fails, just log it
        }
      }
    }
      console.log(1111)

    // Remove password from response
    const { password: _, ...customerWithoutPassword } = updatedCustomer.toObject();

    return NextResponse.json({ 
      success: true, 
      message: 'Customer updated successfully', 
      customer: customerWithoutPassword 
    });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ status: 500, success: false, message: 'Internal server error' });
  }
}

// // pages/api/updateuser/[id].js
// import { dbConnect } from '@/lib/db';
// import Customer from '@/model/customer';
// import { hash } from 'bcryptjs';
// import { NextResponse } from 'next/server';
// export async function PUT(req, {params}) {
//   try {
//     await dbConnect();
//     const { id } = await params;
//     const { username, email, number, province, city, location, password, profilepic  } = await req.json();

//     // Check if customer exists
//     const customer = await Customer.findById(id);
//     if (!customer) {
//       return NextResponse.json({ status: 404, success: false, message: 'Customer not found' });
//     }

//     // Prepare update data
//     const updateData = { 
//       username, 
//       email, 
//       number, 
//       province,
//       city,
//       location,
//       profilepic
//     };

//     // Hash password if provided
//     if (password) {
//       updateData.password = await hash(password, 12);
//     }

//     // Update customer
//     const updatedCustomer = await Customer.findByIdAndUpdate(
//       id, 
//       updateData, 
//       { new: true }
//     );

//     // Remove password from response
//     const { password: _, ...customerWithoutPassword } = updatedCustomer.toObject();

//     return NextResponse.json({ 
//       success: true, 
//       message: 'Customer updated successfully', 
//       customer: customerWithoutPassword 
//     });
//   } catch (error) {
//     console.error('Update error:', error);
//     return NextResponse.json({ status: 500, success: false, message: 'Internal server error' });
//   }
// }



// // pages/api/updateuser/[id].js
// import { dbConnect } from '@/lib/db';
// import Customer from '@/model/customer';
// import { hash } from 'bcryptjs';
// import { NextResponse } from 'next/server';
// export async function PUT(req,{params} ) {
//   try {
//     await dbConnect();
//     const { id } = await params;
//     const { username, email, number, address, password } = await req.json();

//     // Check if customer exists
//     const customer = await Customer.findById(id);
//     if (!customer) {
//       return NextResponse.json({ status: 404,success:false, message: 'Customer not found' });
//     }

//     // Prepare update data
//     const updateData = { 
//       username, 
//       email, 
//       number, 
//       address 
//     };

//     // Hash password if provided
//     if (password) {
//       updateData.password = await hash(password, 12);
//     }

//     // Update customer
//     const updatedCustomer = await Customer.findByIdAndUpdate(
//       id, 
//       updateData, 
//       { new: true }
//     );

//     // Remove password from response
//     const { password: _, ...customerWithoutPassword } = updatedCustomer.toObject();

//     return NextResponse.json({ 
//       success: true, 
//       message: 'Customer updated successfully', 
//       customer: customerWithoutPassword 
//     });
//   } catch (error) {
//     console.error('Update error:', error);
//     return NextResponse.json({ status: 500,success:false, message: 'Internal server error' });
//   }
// }