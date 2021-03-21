export type StateType = {
  rows: number;
  cols: number;
  food: FoodType;
  grid: GridType;
  currentDirection: Directions;
  prevDirection: Directions;
};

export type GridBox = {
  row: number;
  col: number;
};

export type GridType = GridBox[];

export type FoodType = {
  row: number | null;
  col: number | null;
};

export type SnakeType = GridBox[];

export type Directions = "up" | "right" | "down" | "left" | null;
