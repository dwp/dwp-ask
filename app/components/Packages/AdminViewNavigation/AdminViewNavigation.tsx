import AuthWrapper from "../../AuthWrapper/AuthWrapper";

type AdminViewNavigationProps = {
  className?: string;
};

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
