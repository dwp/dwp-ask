import { redirect } from "next/navigation";
import type { AuthWrapperProps } from "@/types";
import { getGroups } from "@/utils";

/**
 * Server component that gates children behind admin role verification.
 * Redirects non-admin users or renders nothing based on redirectConfig.
 */
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
