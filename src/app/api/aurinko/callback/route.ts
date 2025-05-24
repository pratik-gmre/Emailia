import { exchangeCodeForToken, getAccountDetail } from "@/lib/aurinko";
import { client } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const user = await currentUser()


  //note user.id is clerkid
  if (!user) throw new Error("User not logged in");
  console.log("this is user from auth()",user);
  

  const params = req.nextUrl.searchParams;
  const status = params.get("status");
  if (status != "success")
    return NextResponse.json(
      { message: "Failed to link account" },
      { status: 400 }
    );

  const code = params.get("code");
  if (!code)
    return NextResponse.json(
      { message: "Failed to link account" },
      { status: 400 }
    );
  const token = await exchangeCodeForToken(code);
  if (!token)
    return NextResponse.json(
      { message: "Failed to link account" },
      { status: 400 }
    );
console.log("this is token", token);

  const accountDetail = await getAccountDetail(token.accessToken);



const prismaUser = await client.user.findUnique({
  where: { clerkid: user.id },
});
if(!prismaUser){
  return NextResponse.json(
    { message: "Failed to link account" },
    { status: 400 }
  );
}

  await client.account.upsert({
    where: {
      id: token.accountId.toString(),
    },
    update: {
      accessToken: token.accessToken,
    },
    create: {
      id: token.accountId.toString(),
      userId: prismaUser.id,
      emailAddress: accountDetail.email,
      name: accountDetail.name,
      accessToken: token.accessToken,
    },
  });

  return NextResponse.redirect(new URL('/mail',req.url))
};
