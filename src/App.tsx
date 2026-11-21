import { useRef } from "react";
import { Copy } from "./components/Copy";
import { Floor } from "./components/Floor";
import { Header } from "./components/Header";
import { ScrollHint } from "./components/ScrollHint";
import { Sky } from "./components/Sky";
import { useScrollScene } from "./hooks/useScrollScene";

import "./styles/tokens.css";
import "./styles/stage.css";
import "./styles/header.css";
import "./styles/sky.css";
import "./styles/floor.css";
import "./styles/drawings.css";
import "./styles/copy.css";
import "./styles/entrance.css";

export function App() {
  const track = useRef<HTMLElement>(null);
  useScrollScene(track);

  return (
    <main id="track" ref={track}>
      <div className="stage">
        <Header />
        <Sky />
        <Floor />
        <Copy />
        <ScrollHint />
      </div>
    </main>
  );
}
