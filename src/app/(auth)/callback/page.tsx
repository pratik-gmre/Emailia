import React from "react";
import {onAuthenticated} from "../../action/user"
import { useRouter } from "next/navigation";
type Props = {};

const page = async (props: Props) => {
  const router = useRouter();
  const user = await onAuthenticated()
  if(user.status === 200) return router.push('/')
};
export default page;
