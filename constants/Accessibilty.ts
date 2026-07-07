const USABILITY_EXAMPLES: string[] = [
  "Change colours, contrast levels and fonts using browser or device settings",
  "Zoom in up to 200% without the text spilling off the screen",
  "Navigate most of the application using a keyboard or speech recognition software",
  "Listen to most of the application using a screen reader (including recent versions of JAWS, NVDA and VoiceOver)",
  "Change the device orientation from horizontal to vertical without making it more difficult to view the content",
  "Change text size without some of the content overlapping",
];

const INACCESSIBILE_EXAMPLES = [
  {
    description:
      "When using Voice Control software, you may encounter difficulties scrolling the chat and new content may not be tagged with numbers automatically. This is due to an issue with the Voice Control software.",
    solutions: [
      "Say “go to next field” until the focus is set to the next element to update the voice control tags",
      "Say “go to next field” until the focus is set to the scrollable container so that the chat can be scrolled using Voice Control",
    ],
  },
  {
    description:
      "There's a limit to how far you can scroll through the chat and view the messages when zooming to 400%.",
  },
  {
    description:
      "On the Chat History screen, users of assistive technologies may find it difficult to identify the record they are looking for. Users can minimise the number of returned records in the table to search through by setting the date filter to a small range. This will be an area for future improvement of DWP Ask.",
  },
];

const PREPARATION_CONSTANTS = {
  preparedDate: "25 September 2024",
  lastReviewedDate: "27 January 2026",
  lastTestedDate: "27 January 2026",
};

const SUPPORT_EMAIL = "digitalgroup.cassitgn@DWP.GOV.UK";

export {
  INACCESSIBILE_EXAMPLES,
  PREPARATION_CONSTANTS,
  SUPPORT_EMAIL,
  USABILITY_EXAMPLES,
};
