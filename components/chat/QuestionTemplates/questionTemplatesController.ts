/** Holds the currently registered handler for opening the question templates panel. */
let openQuestionTemplatesHandler: (() => void) | null = null;

/**
 * Registers a callback to open the question templates panel.
 * Returns a cleanup function that unregisters the handler.
 *
 * @param handler function to call when the panel should open
 * @returns cleanup function to deregister the handler
 */
const registerQuestionTemplatesOpener = (handler: () => void): (() => void) => {
  openQuestionTemplatesHandler = handler;
  return () => {
    if (openQuestionTemplatesHandler === handler) {
      openQuestionTemplatesHandler = null;
    }
  };
};

/**
 * Invokes the registered handler to programmatically open the question templates panel.
 */
const openQuestionTemplatesPanel = () => {
  openQuestionTemplatesHandler?.();
};

export { openQuestionTemplatesPanel, registerQuestionTemplatesOpener };
