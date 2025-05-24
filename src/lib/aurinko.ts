"use server";
import axios from "axios";
import { auth } from "@clerk/nextjs/server";

export const getAurinkoAuthUrl = async (
  serviceType: "Google" | "Office365"
) => {
  const { userId } = await auth();
  if (!userId) throw new Error("User not logged in");

  const params = new URLSearchParams({
    clientId: process.env.AURINKO_CLIENT_ID as string,
    serviceType,
    scope: "Mail.Read Mail.ReadWrite Mail.Send Mail.Drafts Mail.All",
    responseType: "code",
    returnUrl: `${process.env.NEXT_PUBLIC_URL}/api/aurinko/callback`,
  });

  return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`;
};

export const exchangeCodeForToken = async (code: string) => {
  try {
    const response = await axios.post(
      `https://api.aurinko.io/v1/auth/token/${code}`,
      {},
      {
        auth: {
          username: process.env.AURINKO_CLIENT_ID as string,
          password: process.env.AURINKO_CLIENT_SECRET as string,
        },
      }
    );
    console.log("this is response ", response.data);
    
    return response.data as {
      accountId: number;
      accessToken: string;
      userId: string;
      userSession: string;
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Aurinko API Error:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to exchange code for token"
      );
    }
    throw new Error("Failed to exchange code for token");
  }
};

export const getAccountDetail = async (accessToken: string) => {
  try {
    const response = await axios.get("https://api.aurinko.io/v1/account", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data as {
      email: string;
      name: string;
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Account details error:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "Failed to get account details"
      );
    }
    throw new Error("Failed to get account details");
  }
};
