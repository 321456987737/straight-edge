// pages/api/updateuser/[id].js
import { dbConnect } from '@/lib/db';
import Customer from '@/model/customer';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function PUT(req, {params}) {
  try {
    await dbConnect();
    const { id } = await params;
    const { username, email, number, province, city, location, password } = await req.json();

    // Check if customer exists
    const customer = await Customer.findById(id);
    if (!customer) {
      return NextResponse.json({ status: 404, success: false, message: 'Customer not found' });
    }

    // Prepare update data
    const updateData = { 
      username, 
      email, 
      number, 
      province,
      city,
      location
    };

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