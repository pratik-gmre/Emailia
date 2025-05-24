import { onAuthenticated } from "../../action/user";
import { redirect } from "next/navigation";

type Props = {};


const page = async (props: Props) => {
  const user = await onAuthenticated();
  console.log("his is user ", user);

  if (user.status === 200) return redirect("/");
  else return redirect("/sign-in");
};
export default page;
