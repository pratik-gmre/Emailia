'use server'

import { client } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const onAuthenticated = async () => {
  try {
    const user = await currentUser();
    if (!user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const email = user.emailAddresses[0].emailAddress.toLowerCase();

    const emailExist = await client.user.findUnique({
      where: {
        emailAddress: email,
      },
    });


    if (emailExist) {
      return NextResponse.json(
        { message: "Email already exist", emailExist },
        { status: 200 }
      );
    }

    const newUser = await client.user.create({
      data: {
        emailAddress: email,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
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
