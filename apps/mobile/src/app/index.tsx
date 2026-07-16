import { Redirect } from "expo-router";
import { useRole } from "../context/role-context";
import { Routes } from "../constants/routes";

export default function Index() {
  const { role } = useRole();

  // if (!role) {
  //   return <Redirect href={Routes.Onboarding} />;
  // }

  if (role === "admin") {
    return <Redirect href={Routes.Admin} />;
  }
  if (role === "guard") {
    return <Redirect href={Routes.Guard} />;
  }
  return <Redirect href={Routes.Home} />;
}
