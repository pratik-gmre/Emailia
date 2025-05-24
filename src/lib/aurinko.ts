'use server'

import { auth } from "@clerk/nextjs/server"

export const getAurinkoAuthUrl = async(serviceType:'Google' | 'Office365')=>{
const {userId} = await auth();
if(!userId) throw new Error('User not logged in');



const params = new URLSearchParams({
    clientId : process.env.AURINKO_CLIENT_ID as string,
    serviceType,
    scope:'Mail.Read Mail.ReadWrite  Mail.Send  ,Mail.Drafts  Mail.All',
    responseType:'code',
    returnUrl:`${process.env.NEXT_PUBLIC_URL}/api/aurinko/callback`,

})
console.log("this is params",params);


return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`

}