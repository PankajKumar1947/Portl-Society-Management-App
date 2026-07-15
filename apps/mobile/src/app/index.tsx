import { Redirect } from "expo-router";
import { useRole } from "../context/role-context";

export default function Index() {
  const { role } = useRole();

  // if (!role) {
  //   return <Redirect href="/(onboarding)" />;
  // }

  if (role === "admin") {
    return <Redirect href="/(admin)" />;
  }
  if (role === "guard") {
    return <Redirect href="/(guard)" />;
  }
  return <Redirect href="/(resident)" />;
}
