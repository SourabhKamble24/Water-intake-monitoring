import React from 'react';
import Tilt from 'react-parallax-tilt';

const TiltCard = ({ children, className = '' }) => {
  return (
    <Tilt
      tiltMaxAngleX={5}
      tiltMaxAngleY={5}
      perspective={1000}
      scale={1.02}
      transitionSpeed={1000}
      gyroscope={true}
      className={`h-full ${className}`}
      glareEnable={true}
      glareMaxOpacity={0.15}
      glareColor="lightblue"
      glarePosition="all"
      glareBorderRadius="24px"
    >
      {children}
    </Tilt>
  );
};

export default TiltCard;
