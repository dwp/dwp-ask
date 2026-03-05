type FooterProps = {
  isModalOpen: boolean | undefined;
  pathname: string;
};

const links = [
  {
    href: "/accessibility",
    text: "Accessibility statement",
    dataTest: "accessibility-footer-link",
  },
  {
    href: "/ai-notice",
    text: "AI notice",
    dataTest: "ai-notice-footer-link",
  },
];

export { type FooterProps, links };
