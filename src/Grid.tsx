import React from "react";

interface GridProps {}

export const Grid: React.FC<GridProps> = ({}) => {
  const grid = [];
  for (let index = 0; index < 100; index++) {
    grid.push(<div className="grid-box" key={index}></div>);
  }
  return <div className="grid">{grid}</div>;
};
