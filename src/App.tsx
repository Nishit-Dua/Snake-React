import { useEffect, useState } from "react";
import { FoodType, GridBox, GridType, SnakeType, StateType } from "./types";

const initialState = {
  rows: 20,
  cols: 20,
  food: { row: null, col: null },
  grid: [],
  currentDirection: null,
  prevDirection: null,
};

const App: React.FC = () => {
  const [state, setState] = useState<StateType>(initialState);
  const [gameRunning, setGameRunning] = useState(true);
  const [score, setScore] = useState(1);

  const [snake, setSnake] = useState<SnakeType>([{ col: 0, row: 0 }]);

  const GridCss: React.CSSProperties = {
    gridTemplateColumns: `repeat(${state.cols}, 1fr)`,
    gridTemplateRows: `repeat(${state.rows}, 1fr)`,
  };

  const grid: GridType = [];
  for (let row = 0; row < state.rows; row++) {
    for (let col = 0; col < state.cols; col++) {
      grid.push({
        row,
        col,
      });
    }
  }

  const isFood = (box: GridBox) => {
    return state.food.row === box.row && state.food.col === box.col;
  };

  const isSnake = (box: GridBox) => {
    for (let item of snake) {
      if (item.col === box.col && item.row === box.row) {
        return true;
      }
    }
    return false;
  };

  const makeFoodBox = (): FoodType => {
    let food = {
      row: Math.floor(Math.random() * state.rows),
      col: Math.floor(Math.random() * state.cols),
    };

    while (isSnake(food)) {
      food = {
        row: Math.floor(Math.random() * state.rows),
        col: Math.floor(Math.random() * state.cols),
      };
    }

    return food;
  };

  const finishGame = () => {
    alert(`Game Over, Your score was ${score}`);
    setGameRunning(false);
    setState(initialState);
  };

  const checkGameOver = () => {
    const snakeHead = snake[snake.length - 1];
    if (
      snakeHead.col < 0 ||
      snakeHead.row < 0 ||
      snakeHead.col > state.cols - 1 ||
      snakeHead.row > state.rows - 1
    ) {
      finishGame();
    }
    for (let snakeBodyPart of snake.slice(0, snake.length - 1)) {
      if (
        snakeHead.col === snakeBodyPart.col &&
        snakeHead.row === snakeBodyPart.row
      ) {
        finishGame();
      }
    }
  };

  useEffect(() => {
    setScore(snake.length);
  }, [snake.length]);

  useEffect(() => {
    checkGameOver();
    const gameInterval = setInterval(() => {
      let newSnake = [...snake];
      const snakeHead = snake[snake.length - 1];
      switch (state.currentDirection) {
        case "right":
          if (state.prevDirection !== "left")
            newSnake.push({ col: snakeHead.col + 1, row: snakeHead.row });
          break;
        case "left":
          if (state.prevDirection !== "right")
            newSnake.push({ col: snakeHead.col - 1, row: snakeHead.row });
          break;
        case "up":
          if (state.prevDirection !== "down")
            newSnake.push({ col: snakeHead.col, row: snakeHead.row - 1 });
          break;
        case "down":
          if (state.prevDirection !== "up")
            newSnake.push({ col: snakeHead.col, row: snakeHead.row + 1 });
          break;
        default:
          break;
      }
      if (state.currentDirection) {
        if (!isFood(snakeHead)) {
          newSnake.shift();
        } else if (isFood(snakeHead)) {
          setState((oldState) => {
            return { ...oldState, food: makeFoodBox() };
          });
        }
      }
      setSnake(newSnake);
    }, 50);

    return () => clearInterval(gameInterval);
  }, [state.currentDirection, state.prevDirection, snake]);

  useEffect(() => {
    setState((oldState) => {
      return { ...oldState, grid: grid, food: makeFoodBox() };
    });
    setSnake([{ col: 0, row: 0 }]);
    setGameRunning(true);
  }, [gameRunning]);

  useEffect(() => {
    const { currentDirection } = state;
    const keyPressFxn = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          if (currentDirection !== "down" && currentDirection !== "up") {
            setState((val) => {
              return {
                ...val,
                prevDirection: val.currentDirection,
                currentDirection: "down",
              };
            });
          }
          break;
        case "ArrowUp":
          if (currentDirection !== "down" && currentDirection !== "up") {
            setState((val) => {
              return {
                ...val,
                prevDirection: val.currentDirection,
                currentDirection: "up",
              };
            });
          }
          break;
        case "ArrowLeft":
          if (currentDirection !== "right" && currentDirection !== "left") {
            setState((val) => {
              return {
                ...val,
                prevDirection: val.currentDirection,
                currentDirection: "left",
              };
            });
          }
          break;
        case "ArrowRight":
          if (currentDirection !== "right" && currentDirection !== "left") {
            setState((val) => {
              return {
                ...val,
                prevDirection: val.currentDirection,
                currentDirection: "right",
              };
            });
          }
          break;
      }
    };

    document.addEventListener("keydown", keyPressFxn);
    return () => {
      document.removeEventListener("keydown", keyPressFxn);
    };
  }, [state]);

  return (
    <>
      <h2>Current Score: {score} </h2>
      <div className="grid" style={GridCss}>
        {state.grid.map((gridItem) => {
          let classAssign = "grid-box";
          if (isFood(gridItem) && isSnake(gridItem)) {
            classAssign = "eating-box";
          } else if (isFood(gridItem)) {
            classAssign = "food-box";
          } else if (isSnake(gridItem)) {
            classAssign = "snake-box";
          }
          return (
            <div
              className={`box ${classAssign}`}
              key={`${gridItem.row}-${gridItem.col}`}
            ></div>
          );
        })}
      </div>
    </>
  );
};

export default App;
