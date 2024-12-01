import { useEffect, useState } from "react";
import SkeletonMessage from "./SkeletonMessage";

function SkeletonMessageList({ parentRef }: { parentRef: any }) {
  let [countToRender, setCountToRender] = useState(0);

  useEffect(() => {
    let parentHeight = parentRef?.current?.offsetHeight;
    let elementsToRender = Math.floor(parentHeight / 42);
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

export default SkeletonMessageList;
