import { client } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { data } = await req.json();

    const email = data.email_addresses[0].email_address;
    const newUser = await client.user.create({
      data: {
        emailAddress: email,
        firstName: data?.first_name,
        lastName: data?.last_name,
        imageUrl: data?.image_url,
      },
    });

    console.log("clerk webhook receiverd");

    return NextResponse.json({message:newUser},{ status: 200 });
  } catch (error) {
    return NextResponse.json({status:500,message:error})
  }
};
