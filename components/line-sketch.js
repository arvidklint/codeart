import P5Wrapper from "./p5wrapper";
import lineSketch from "../sketches/lines";
import styles from "../styles/Sketch.module.css";

export default function LineSketch() {
  return (
    <div className={styles.container}>
      <P5Wrapper sketch={lineSketch} />
    </div>
  );
}
