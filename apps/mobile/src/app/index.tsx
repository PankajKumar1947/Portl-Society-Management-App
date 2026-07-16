import { Redirect } from "expo-router";
import { useRole } from "../context/role-context";

export default function Index() {
  const { role } = useRole();

  if (!role) {
    return <Redirect href="/(onboarding)" />;
  }

  return <Redirect href="/(app)" />;
}
