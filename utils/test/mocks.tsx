/**
 * Shared test mocks for component testing
 * Centralizes common mock patterns to ensure consistency across test files
 */

/**
 * Mock for @/components barrel export
 * Provides lightweight mock implementations of commonly used components
 */
import type {
  ErrorSummaryItemType,
  ErrorSummaryProps,
  MockChildrenAndProps,
  MockLinkProps,
  PaginationProps,
  QueryTextAreaProps,
  SectionBreakProps,
  TableCellProps,
  TableWrapperProps,
} from "@/types";

export const mockComponents = {
  createAccordionMarkdownOptions: () => ({}),
  BackLink: ({ children, ...props }: MockChildrenAndProps) => (
    <a {...props}>{children}</a>
  ),
  Title: ({ children, ...props }: MockChildrenAndProps) => (
    <h2 data-testid={props["data-testid"] ?? "title"} {...props}>
      {children}
    </h2>
  ),
  Paragraph: ({ children, ...props }: MockChildrenAndProps) => (
    <p data-testid={props["data-testid"] ?? "paragraph"} {...props}>
      {children}
    </p>
  ),
  WarningText: ({ children, ...props }: MockChildrenAndProps) => (
    <div {...props}>{children}</div>
  ),
  ErrorSummary: ({ errors }: ErrorSummaryProps) => (
    <div data-testid="error-summary">
      {errors?.map((err: ErrorSummaryItemType, idx: number) => (
        <div key={idx}>{err.text}</div>
      ))}
    </div>
  ),
  TableWrapper: ({ children, columnTitles, ...props }: TableWrapperProps) => (
    <table {...props}>
      {columnTitles && (
        <thead>
          <tr>
            {columnTitles.map((title: string, index: number) => (
              <th key={index}>{title}</th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>{children}</tbody>
    </table>
  ),
  TableRow: ({ children, ...props }: MockChildrenAndProps) => (
    <tr {...props}>{children}</tr>
  ),
  TableCell: ({ children, title, ...props }: TableCellProps) => (
    <td {...props} title={title}>
      {children}
    </td>
  ),
  Pagination: ({ currentPage, totalPages, onPageChange }: PaginationProps) => (
    <div data-testid="pagination-mock">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        data-testid="prev-button"
      >
        Previous
      </button>
      <span data-testid="page-info">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        data-testid="next-button"
      >
        Next
      </button>
    </div>
  ),
  Link: ({ children, onClick, ...props }: MockLinkProps) => (
    <a onClick={onClick} {...props}>
      {children}
    </a>
  ),
  SanitisedMarkdown: ({ children }: MockChildrenAndProps) => (
    <div data-testid="mock-sanitised">{children}</div>
  ),
  Button: ({ children, ...props }: MockChildrenAndProps) => (
    <button {...props}>{children}</button>
  ),
  SectionBreak: ({ visible, level }: SectionBreakProps) => (
    <div data-testid={`section-break-${level}`}>{visible ? "v" : "x"}</div>
  ),
  InsetText: ({ children }: MockChildrenAndProps) => (
    <div data-testid="inset">{children}</div>
  ),
  Main: ({ children }: MockChildrenAndProps) => <main>{children}</main>,
  Analytics: () => <div data-testid="analytics" />,
  ButtonArrow: () => <span data-testid="btn-arrow" />,
  AINotice: () => <div data-testid="ai-notice" />,
  Typing: () => <div data-testid="typing">Typing...</div>,
  QueryTextArea: ({
    value,
    onChange,
    onKeyDown,
    sendQueryAndClear,
    error,
  }: QueryTextAreaProps) => (
    <div>
      <textarea
        data-testid="query-textarea"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <button data-testid="send-button" onClick={sendQueryAndClear}>
        Send
      </button>
      {error?.blank && (
        <span data-testid="blank-error">Query cannot be blank</span>
      )}
      {error?.location && (
        <span data-testid="location-error">Location required</span>
      )}
    </div>
  ),
};

/**
 * Standard navigation mock pattern
 * Use this in tests that need next/navigation
 */
export const mockNextNavigation = () => {
  const mockPush = vi.fn();
  return {
    mockPush,
    mock: () => ({
      useRouter: () => ({ push: mockPush }),
      usePathname: () => "/chat",
    }),
  };
};

/**
 * Mock for @/utils
 */
export const mockHelpers = {
  dateFormatForHistoryPage: vi.fn((date: string) => [
    "2024-01-15",
    "formatted",
  ]),
  truncate: vi.fn((text: string, length: number) =>
    text.length > length ? `${text.substring(0, length)}...` : text,
  ),
  formatTitle: (title: string, index: number) => `TITLE:${index}:${title}`,
  formatMarkdown: (chunks: string) => `MARKDOWN:${chunks}`,
};

/**
 * Mock for @/utils
 */
export const mockStorage = {
  storeViewDetails: vi.fn(),
};

/**
 * Mock for @/providers
 */
export const mockProviders = {
  useModal: () => ({
    resetModals: vi.fn(),
    setModalVisible: vi.fn(),
  }),
  useLocation: () => ({
    location: "england",
    setLocation: vi.fn(),
  }),
};

export const createMockResponse = (
  override: Partial<Response> = {},
): Response => ({
  ok: true,
  status: 200,
  statusText: "OK",
  headers: new Headers(),
  redirected: false,
  type: "basic",
  url: "",
  body: null,
  bodyUsed: false,
  json: vi.fn().mockResolvedValue({}),
  text: vi.fn().mockResolvedValue(""),
  blob: vi.fn().mockResolvedValue(new Blob()),
  arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
  formData: vi.fn().mockResolvedValue(new FormData()),
  bytes: vi.fn().mockResolvedValue(new Uint8Array()),
  clone: vi.fn(),
  ...override,
});
