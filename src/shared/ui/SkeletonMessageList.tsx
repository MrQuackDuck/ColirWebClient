import { useEffect, useState } from "react";

import { SkeletonMessage } from "./SkeletonMessage";

export function SkeletonMessageList({ parentRef }: { parentRef: any }) {
  const [countToRender, setCountToRender] = useState(0);

  useEffect(() => {
    const parentHeight = parentRef?.current?.offsetHeight;
    const elementsToRender = Math.floor(parentHeight / 42);
    setCountToRender(elementsToRender);
  });

  return (
    <>
      {Array.from(Array(countToRender).keys()).map((i) => (
        <SkeletonMessage key={i} />
      ))}
    </>
  );
}
