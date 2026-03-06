let openQuestionTemplatesHandler: (() => void) | null = null;

const registerQuestionTemplatesOpener = (handler: () => void): (() => void) => {
  openQuestionTemplatesHandler = handler;
  return () => {
    if (openQuestionTemplatesHandler === handler) {
      openQuestionTemplatesHandler = null;
    }
  };
};

const openQuestionTemplatesPanel = () => {
  openQuestionTemplatesHandler?.();
};

export { registerQuestionTemplatesOpener, openQuestionTemplatesPanel };
