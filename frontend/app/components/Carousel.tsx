import React, { useEffect, useState } from "react";
import styles from "styles/components/carousel.css";
import { v4 as uuidv4 } from "uuid";
import { Next } from "./icons/Next";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const Carousel: React.FunctionComponent = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [translationValue, setTranslationValue] = useState(33);

  const deviceOffset = {
    mobile: 1,
    tablet: 1,
    desktop: 3,
  };

  const getDeviceType = () => {
    if (window.matchMedia("(max-width: 600px)").matches) {
      return "mobile";
    }
    if (window.matchMedia("(max-width: 1000px)").matches) {
      return "tablet";
    }

    return "desktop";
  };

  const updateIndexForDevice = (offset: number) => (newIndex: number) => {
    if (newIndex < 0) {
      setActiveIndex(React.Children.count(children) - offset);

      return;
    }
    if (newIndex >= React.Children.count(children) - (offset - 1)) {
      setActiveIndex(0);

      return;
    }
    setActiveIndex(newIndex);
  };

  const updateIndex = (newIndex: number) => {
    return updateIndexForDevice(deviceOffset[getDeviceType()])(newIndex);
  };

  useEffect(() => {
    const getTranslationValue = () => {
      if (window.matchMedia("(max-width: 1000px)").matches) {
        return 100;
      }

      return 33;
    };

    setTranslationValue(getTranslationValue());
  });

  return (
    <div className="carousel-container">
      <button
        className="carousel__button carousel__button--previous"
        onClick={() => updateIndex(activeIndex - 1)}
      >
        <Next
          className="carousel__button__icon carousel__button__icon--previous"
          width={30}
        />
      </button>
      <div className="carousel">
        <div
          className="inner-carousel"
          style={{
            transform: `translateX(-${activeIndex * translationValue}%)`,
          }}
        >
          {React.Children.map(children, (child) => {
            return (
              <div key={uuidv4()} className="carousel-item">
                {child}
              </div>
            );
          })}
        </div>
        <div className="indicators"></div>
      </div>
      <button
        className="carousel__button carousel__button--next"
        onClick={() => updateIndex(activeIndex + 1)}
      >
        <Next className="carousel__button__icon" width={30} />
      </button>
    </div>
  );
};
