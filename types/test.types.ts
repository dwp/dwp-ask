import { Citations } from "./api.types";

export type MockChildrenAndProps = {
  children: React.ReactNode;
  "data-testid"?: string;
};

export type MockLinkProps = MockChildrenAndProps & {
  onClick: React.MouseEventHandler<HTMLAnchorElement>;
};

export type MockNextScriptProps = {
  children: React.ReactNode;
  id: string | undefined;
};
export type MockQueryResponseType = {
  question: string;
  answer: string;
  type?: string;
  citations?: Citations;
  timestamp?: string;
};
