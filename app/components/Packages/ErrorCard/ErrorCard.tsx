import { ReactNode } from "react";
import Heading from "../Heading/Heading";

type ErrorCardProps = {
  children: ReactNode;
};

const ErrorCard: React.FC<ErrorCardProps> = ({ children }) => {
  return (
    <>
      <Heading data-testid="error-card-heading">There is a problem</Heading>
      {children}
    </>
  );
};

export default ErrorCard;
