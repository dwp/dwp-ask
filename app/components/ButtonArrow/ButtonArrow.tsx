type ButtonArrowProps = {
  fill?: string;
};

export default function ButtonArrow({ fill }: ButtonArrowProps) {
  return (
    <svg
      viewBox="0 0 706 860"
      fill={fill ?? "white"}
      data-testid="button-arrow"
    >
      <g>
        <path d="M.152 0h252.993l452.108 430H452.261z" />
        <path fillOpacity="0.5" d="M0 860h252.993L705.1 430H452.108z" />
      </g>
    </svg>
  );
}
