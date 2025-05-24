"use server";

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
         clerkid: user.id,
      },
    });

    if (emailExist) {
      return { status: 200, user: emailExist };
    }

    const newUser = await client.user.create({
      data: {
        clerkid: user.id,
        emailAddress: email,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      },
    });

    return { status: 200, user: newUser };
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
