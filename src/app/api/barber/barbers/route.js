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
        .find({ "ratings.rating": { $gt: 0 } })
        .select('-password')
        .sort({ rating: -1 })
        .skip(skip)
        .limit(limit);

      // Count total top-rated barbers to determine if there are more
      const totalTopRated = await barber.countDocuments({ "ratings.rating": { $gt: 0 } });
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


export async function DELETE(req){
  try{
    await dbConnect();
    const body = await req.json();
    const {id} = body;
    const Barber = await barber.deleteOne({ _id: id });
    return NextResponse.json({barber:Barber, success: true,message: 'Barber deleted successfully' }, { status: 200 })
  }catch(err){
    return NextResponse.json({ error: 'Internal Server Error', seccess:false }, { status: 500 })
  }
}