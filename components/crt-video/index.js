import { useEffect, useRef, useState } from "react";
import crt from "../../three/crt";
import styles from "./crt-video.module.css";

export default function CrtVideo() {
  const div = useRef(null);
  const [toggler, setToggleFunction] = useState(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = "/flowers.mp4";
    video.load();
    video.muted = true;
    video.loop = true;
    div.current.appendChild(video);

    const onPlay = () => {
      video.play();
      const t = crt(video);
      setToggleFunction(() => t);
    };

    video.addEventListener("canplaythrough", () => onPlay());

    return () => {
      video.removeEventListener("canplaythrough", () => onPlay());
    };
  }, []);

  return (
    <div>
      <label className={styles.switch}>
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => {
            toggler(e.target.checked);
            setActive(e.target.checked);
          }}
        />
        <span className={styles.checkbox}></span>
      </label>
      <div ref={div} className={styles["video-container"]}></div>
    </div>
  );
}
