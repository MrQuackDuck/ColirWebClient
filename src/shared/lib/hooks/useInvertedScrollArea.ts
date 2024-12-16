import { useStickToBottom } from "use-stick-to-bottom";

export const useInvertedScrollArea = () => {
  const { scrollRef, contentRef, scrollToBottom, isAtBottom } = useStickToBottom({
    initial: "instant",
    resize: "smooth",
    stiffness: 0.08,
  });

  return { scrollRef, contentRef, scrollToBottom: scrollToBottom, isAtBottom };
};
