import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_API_SECRET,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { timestamp, ...restParams } = body

    // Generate signature
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, ...restParams },
      process.env.NEXT_PUBLIC_API_SECRET!,
    )

    return NextResponse.json({ signature })
  } catch (error) {
    console.error('Error generating signature:', error)
    return NextResponse.json(
      { message: 'Error generating signature' },
      { status: 500 },
    )
  }
}
