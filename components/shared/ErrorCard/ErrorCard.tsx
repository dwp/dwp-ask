import { Title } from "@/components";
import type { ErrorCardProps } from "@/types";

/** Displays a "There is a problem" heading with child error content. */
const ErrorCard: React.FC<ErrorCardProps> = ({ children }) => {
  return (
    <>
      <Title level="h1" data-testid="error-card-heading">
        There is a problem
      </Title>
      {children}
    </>
  );
};

export default ErrorCard;
