import {
  openQuestionTemplatesPanel,
  registerQuestionTemplatesOpener,
} from "../questionTemplatesController";

describe("questionTemplatesController", () => {
  it("does not clear handler when a different handler has been registered", () => {
    const handlerA = vi.fn();
    const handlerB = vi.fn();

    const unregisterA = registerQuestionTemplatesOpener(handlerA);
    registerQuestionTemplatesOpener(handlerB);

    // Unregistering A should not clear B
    unregisterA();

    openQuestionTemplatesPanel();
    expect(handlerB).toHaveBeenCalledTimes(1);
    expect(handlerA).not.toHaveBeenCalled();
  });
});
