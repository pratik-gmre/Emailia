"use client";

import React from "react";
import { Button } from "./button";
import {getAurinkoAuthUrl} from "../../lib/aurinko"
import { useRouter } from "next/navigation";

const LinkAccountButton = () => {
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        const authUrl = await getAurinkoAuthUrl("Google");
        router.push(authUrl);

        
      }}
    >
      Link Account
    </Button>
  );
};

export default LinkAccountButton;
