import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import barber from '@/model/barber';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const province = searchParams.get('province') || '';
    const city = searchParams.get('city') || '';
    const specialty = searchParams.get('specialty') || '';
    const rating = searchParams.get('rating') || '';
    const skip = parseInt(searchParams.get('skip') || '0', 10);
    const limit = parseInt(searchParams.get('limit') || '8', 10);
    const fetchTopRated = searchParams.get('topRated') === 'true';
      console.log(specialty,"this is the specialty ")
    // If requesting top-rated barbers, return those with highest ratings
    if (fetchTopRated) {
      const topBarbers = await barber
        .find({ rating: { $gt: 0 } })
        .select('-password')
        .sort({ rating: -1 })
        .skip(skip)
        .limit(6);

      // Count total top-rated barbers to determine if there are more
      const totalTopRated = await barber.countDocuments({ rating: { $gt: 0 } });
      const hasMoreTopRated = skip + topBarbers.length < totalTopRated;

      return NextResponse.json({
        success: true,
        topRatedBarbers: topBarbers,
        totalTopRated,
        hasMoreTopRated
      });
    }

    // Build filter object for regular search
    let filter = {};

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { province: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
      
      // Special handling for services array
      filter.$or.push({
        'services.name': { $regex: search, $options: 'i' }
      });
    }

    if (province) {
      filter.province = { $regex: province, $options: 'i' };
    }

    if (city) {
      filter.city = { $regex: city, $options: 'i' };
    }

    if (specialty) {
      filter['services.name'] = { $regex: specialty, $options: 'i' };
    }

    if (rating) {
      filter.rating = { $gte: parseFloat(rating) };
    }

    // Pagination logic
    const total = await barber.countDocuments(filter);
    const hasMore = skip + limit < total;
    
    const Barbers = await barber
      .find(filter)
      .select('-password')
      .skip(skip)
      .limit(limit);
      console.log(Barbers,"this is the barber")
    return NextResponse.json({
      success: true,
      Barbers,
      total,
      hasMore
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
// import { NextResponse } from 'next/server';
// import { dbConnect } from '@/lib/db';
// import barber from '@/model/barber';

// export async function GET(request) {
//   try {
//     console.log(1)
//     await dbConnect();
//     console.log(1)

//     const { searchParams } = new URL(request.url);
//     const search = searchParams.get('search') || '';
//     const province = searchParams.get('province') || '';
//     const city = searchParams.get('city') || '';
//     const specialty = searchParams.get('specialty') || '';
//     const rating = searchParams.get('rating') || '';
//     const page = parseInt(searchParams.get('page') || '1', 10);
//     const limit = parseInt(searchParams.get('limit') || '2', 2);
//     console.log(1)

//     // Build filter object
//     let filter = {};
//     console.log(1)

//     if (search) {
//       filter.$or = [
//         { username: { $regex: search, $options: 'i' } },
//         { province: { $regex: search, $options: 'i' } },
//         { city: { $regex: search, $options: 'i' } }
//       ];
//     console.log(1)
      
//       // Special handling for services array
//       filter.$or.push({
//         'services.name': { $regex: search, $options: 'i' }
//       });
//     }

//     if (province) {
//       filter.province = { $regex: province, $options: 'i' };
//     }

//     if (city) {
//       filter.city = { $regex: city, $options: 'i' };
//     }

//     if (specialty) {
//       filter['services.name'] = { $regex: specialty, $options: 'i' };
//     }

//     if (rating) {
//       filter.rating = { $gte: parseFloat(rating) };
//     }
//     console.log(1)

//     // Pagination logic
//     const total = await barber.countDocuments(filter);
//     const pages = Math.ceil(total / limit);
//     const skip = (page - 1) * limit;

//     const Barbers = await barber
//       .find(filter)
//       .select('-password')
//       .skip(skip)
//       .limit(limit);
//     console.log(1)

//     return NextResponse.json({
//       success: true,
//       Barbers,
//       page,
//       pages,
//       total,
//       hasMore: page < pages
//     });
//   } catch (error) {
//     console.error('Search error:', error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

// // app/api/barber/barbers/route.js
// import { NextResponse } from 'next/server';
// import barber from '@/model/barber'; // Your Barber model
// import { dbConnect } from '@/lib/db'; // Your MongoDB connection

// export async function GET(request) {
//   try {
//     await dbConnect();

//     const { searchParams } = new URL(request.url);
//     const search = searchParams.get('search') || '';
//     const province = searchParams.get('province') || '';
//     const city = searchParams.get('city') || '';
//     const specialty = searchParams.get('specialty') || '';
//     const rating = searchParams.get('rating') || '';
//     const page = parseInt(searchParams.get('page') || '1', 10);
//     const limit = parseInt(searchParams.get('limit') || '10', 10);

//     // Build filter object
//     let filter = {};

//     if (search) {
//       filter.$or = [
//         { username: { $regex: search, $options: 'i' } },
//         { province: { $regex: search, $options: 'i' } },
//         { city: { $regex: search, $options: 'i' } },
//         { services: { $regex: search, $options: 'i' } }
//       ];
//     }

//     if (province) {
//       filter.province = { $regex: province, $options: 'i' };
//     }

//     if (city) {
//       filter.city = { $regex: city, $options: 'i' };
//     }

//     if (specialty) {
//       filter.services = { $regex: specialty, $options: 'i' };
//     }

//     if (rating) {
//       filter.rating = { $gte: parseFloat(rating) };
//     }

//     // Pagination logic
//     const total = await barber.countDocuments(filter);
//     const pages = Math.ceil(total / limit);
//     const skip = (page - 1) * limit;

//     const Barbers = await barber
//       .find(filter)
//       .select('-password')
//       .skip(skip)
//       .limit(limit);

//     return NextResponse.json({
//       success: true,
//       Barbers,
//       page,
//       pages,
//       total,
//       hasMore: page < pages
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }
// // // app/api/barber/barbers/route.js
// // import { NextResponse } from 'next/server';
// // import barber from '@/model/barber'; // Your Barber model
// // import {dbConnect} from '@/lib/db'; // Your MongoDB connection

// // export async function GET(request) {
// //   try {
// //     await dbConnect();
    
// //     const { searchParams } = new URL(request.url);
// //     const search = searchParams.get('search') || '';
// //     const province = searchParams.get('province') || '';
// //     const city = searchParams.get('city') || '';
// //     const specialty = searchParams.get('specialty') || '';
// //     const rating = searchParams.get('rating') || '';

// //     // Build filter object
// //     let filter = {};
    
// //     if (search) {
// //       filter.$or = [
// //         { username: { $regex: search, $options: 'i' } },
// //         { province: { $regex: search, $options: 'i' } },
// //         { city: { $regex: search, $options: 'i' } },
// //         { services: { $regex: search, $options: 'i' } }
// //       ];
// //     }
    
// //     if (province) {
// //       filter.province = { $regex: province, $options: 'i' };
// //     }
    
// //     if (city) {
// //       filter.city = { $regex: city, $options: 'i' };
// //     }
    
// //     if (specialty) {
// //       filter.services = { $regex: specialty, $options: 'i' };
// //     }
    
// //     if (rating) {
// //       filter.rating = { $gte: parseFloat(rating) };
// //     }

// //     const Barbers = await barber.find(filter).select('-password');

// //     return NextResponse.json({
// //       success: true,
// //       Barbers: Barbers
// //     });
// //   } catch (error) {
// //     return NextResponse.json(
// //       { success: false, error: error.message },
// //       { status: 500 }
// //     );
// //   }
// // }
// // // import { NextResponse } from "next/server";
// // // import { dbConnect } from "@/lib/db";   // make sure you have this
// // // import barber from "@/model/barber";   // your Barber model

// // // export async function GET(req) {
// // //   try {
// // //     await dbConnect();

// // //     const { search } = Object.fromEntries(new URL(req.url).searchParams);
// // //     const query = search?.trim() || "";

// // //     let Barbers = [];
// // //     if (query) {
// // //       Barbers = await barber.find({
// // //         $or: [
// // //           { username: { $regex: query, $options: "i" } },
// // //           { email: { $regex: query, $options: "i" } },
// // //           { city: { $regex: query, $options: "i" } },
// // //           { specialty: { $regex: query, $options: "i" } },
// // //         ],
// // //       }).select("username city specialty");
// // //     }

// // //     return NextResponse.json({ Barbers:Barbers,success: true }, { status: 200 });
// // //   } catch (err) {
// // //     console.error("Search error:", err);
// // //     return NextResponse.json({ error: "Server error" }, { status: 500 });
// // //   }
// // // }
