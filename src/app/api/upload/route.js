// app/api/upload/route.js
import { NextResponse } from 'next/server';
import imageKitConfig from "@/app/api/imagekit-auth/route"
export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images');
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    const uploadPromises = files.map(async (file) => {
      try {
        const fileBuffer = await file.arrayBuffer();
        
        const result = await imageKitConfig.upload({
          file: Buffer.from(fileBuffer),
          fileName: `profile_${Date.now()}_${file.name}`,
          folder: '/profiles',
          useUniqueFileName: true
        });

        return {
          url: result.url,
          fileId: result.fileId,
          thumbnailUrl: `${result.url}?tr=w-300,h-300`
        };
      } catch (error) {
        console.error('Error uploading single file:', error);
        throw error;
      }
    });

    const results = await Promise.all(uploadPromises);
      
    
    return NextResponse.json({ 
      success: true,
      images: results 
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to upload images',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { fileId } = await request.json();
    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }

    await imageKitConfig.deleteFile(fileId); 

    return NextResponse.json({ 
      success: true,
      message: 'File deleted successfully' 
    });

  } catch (error) {
    console.error('Delete route error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to delete file',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// import { NextResponse } from 'next/server';
// import imageKitConfig from '@/app/api/imagekit-auth/route';


// export async function POST(request) {
//   try {
//     const formData = await request.formData();
//     const files = formData.getAll('images');
//     console.log(1)
//     if (!files || files.length === 0) {
//       return NextResponse.json(
//         { error: 'No images provided' },
//         { status: 400 }
//       );
//     }
//     console.log(1)

//     const uploadPromises = files.map(async (file) => {
//       try {
//         // Get the file as a buffer
//         const fileBuffer = await file.arrayBuffer();
//     console.log(1)
        
//         // Upload to ImageKit
//         const result = await imageKitConfig.upload({
//           file: Buffer.from(fileBuffer),
//           fileName: file.name,
//           folder: '/straightedge',
//           useUniqueFileName: true
//         });
//     console.log(1)

//         return {
//           url: result.url,
//           fileId: result.fileId,
//           thumbnailUrl: `${result.url}?tr=w-300,h-300`
//         };
//       } catch (error) {
//         console.error('Error uploading single file:', error);
//         throw error;
//       }
//     });
//     console.log(uploadPromises,"this si the upload promise")
//     console.log(1)
      
//     const results = await Promise.all(uploadPromises);
//     console.log(results,"this si the results")
//     return NextResponse.json({ 
//       success: true,
//       images: results 
//     });

//   } catch (error) {
//     console.error('Upload route error:', error);
//     return NextResponse.json(
//       { 
//         success: false,
//         error: 'Failed to upload images',
//         details: error.message 
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(req, { params }) {
//   try{
//     const body = await req.json();
//     const {fileId} = body;
//     console.log(fileId,"this is the file id")
//   }catch(err){
//     return NextResponse.json({ error: 'Internal Server Error', seccess:false }, { status: 500 })
//   }
// }


