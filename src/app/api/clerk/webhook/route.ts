import { client } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const data = body.data;

    const email = data?.email_addresses?.[0]?.email_address;
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const emailExist = await client.user.findUnique({
      where: {
        emailAddress: email,
      },
    });
    if (emailExist) {
      return NextResponse.json(
        { message: "Email already exist" },
        { status: 400 }
      );
    }

    const newUser = await client.user.create({
      data: {
        emailAddress: email,
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        imageUrl: data.image_url || data.profile_image_url || "",
      },
    });

    return NextResponse.json(newUser, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
