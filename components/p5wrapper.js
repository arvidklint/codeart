// @refresh reset
import p5 from "p5";
import { useEffect, useRef, useState } from "react";

export default function P5Wrapper({ sketch }) {
  const [canvas, setCanvas] = useState(null);
  const wrapper = useRef(null);

  useEffect(() => {
    setCanvas(new p5(sketch));

    return () => {
      if (canvas !== null) {
        canvas.remove();
      }
    };
  }, []);

  return <>{canvas && <div ref={wrapper}></div>}</>;
}
