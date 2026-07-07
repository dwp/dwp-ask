import { AuthWrapper } from "@/components";
import type { AdminViewNavigationProps } from "@/types";

/**
 * Navigation link to the admin dashboard. Only rendered for admin users
 * via the AuthWrapper access control.
 */
export default function AdminViewNavigation({
  className,
}: AdminViewNavigationProps = {}) {
  return (
    <AuthWrapper redirectConfig={{ redirect: false }}>
      <a
        href="/admin"
        className={`govuk-link ${className ?? ""}`}
        data-testid="admin-view-link-chat-page"
      >
        Admin
      </a>
    </AuthWrapper>
  );
}
