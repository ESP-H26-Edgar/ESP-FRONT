import { useState, type JSX } from "react";

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T) => JSX.Element;
  visible?: number;
}

export default function Carousel<T>({
  items,
  renderItem,
  visible = 4,
}: CarouselProps<T>) {
  const [index, setIndex] = useState(0);
  const canPrev = index > 0;
  const canNext = index + visible < items.length;

  return (
    <div className="carousel-wrapper">
      <button
        className="carousel-btn"
        onClick={() => setIndex((i) => i - 1)}
        disabled={!canPrev}
      >
        ‹
      </button>
      <div
        className="carousel-track"
        style={{ gridTemplateColumns: `repeat(${visible}, 1fr)` }}
      >
        {items.slice(index, index + visible).map(renderItem)}
      </div>
      <button
        className="carousel-btn"
        onClick={() => setIndex((i) => i + 1)}
        disabled={!canNext}
      >
        ›
      </button>
    </div>
  );
}
