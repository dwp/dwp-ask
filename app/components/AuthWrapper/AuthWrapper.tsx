import { redirect } from "next/navigation";
import getGroups from "@/app/utils/api/getGroups";

type AuthWrapperProps = {
  children: React.ReactNode;
  redirectConfig:
    | { redirect: false }
    | { redirect: true; redirectPage: string };
};

export default async function AuthWrapper({
  children,
  redirectConfig,
}: AuthWrapperProps) {
  const res = await getGroups();
  const isValidUser = res?.is_admin_user ?? false;

  if (redirectConfig.redirect && !isValidUser) {
    redirect(redirectConfig.redirectPage);
  } else if (!redirectConfig.redirect && !isValidUser) {
    return <></>;
  }

  return <>{children}</>;
}
