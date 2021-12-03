import { useSession } from "next-auth/react";
import Loading from "./Loading";

export default function Auth({ children }) {
  const { data, status } = useSession({
    required: true,
  });

  if (status === "loading") return <Loading />;

  return children;
}
