<script lang="ts">
  import { innerHeight, innerWidth } from "svelte/reactivity/window";
  import image from "./assets/svelte.svg";
  import { onDestroy } from "svelte";

  type Coordinate = {
    x: number;
    y: number;
  };

  const NORTH = "NORTH";
  const EAST = "EAST";
  const SOUTH = "SOUTH";
  const WEST = "WEST";
  const height = $state(innerHeight.current);
  const width = $state(innerWidth.current);

  let curDirection: string = $state(EAST);
  let posX = $state(width / 2);
  let posY = $state(height / 2);
  let ongoingGame: boolean = $state(true);
  let score: number = 0;

  function calculateNewPos(x: number, y: number, direction: string): Coordinate {
    let coordinates: Coordinate;

    switch (direction) {
      case NORTH:
        coordinates = { x, y: y - 10 };
        break;
      case EAST:
        coordinates = { x: x + 10, y };
        break;
      case SOUTH:
        coordinates = { x, y: y + 10 };
        break;
      case WEST:
        coordinates = { x: x - 10, y };
        break;
      default:
        throw new Error("Unknown direction used to calculate new position.");
    }

    return coordinates;
  }

  function move(): void {
    score++;
    const { x, y } = calculateNewPos(posX, posY, curDirection);
    console.log(`x: ${x}, y: ${y}`);
    posX = x;
    posY = y;
  }

  function keyHandler(event) {
    const keyName = event.key;

    switch (keyName) {
      case "ArrowUp":
        curDirection = NORTH;
        break;
      case "ArrowRight":
        curDirection = EAST;
        break;
      case "ArrowDown":
        curDirection = SOUTH;
        break;
      case "ArrowLeft":
        curDirection = WEST;
        break;
    }
  }

  function startGame(): number {
    document.addEventListener("keydown", (event) => keyHandler(event));

    const moveInterval: number = setInterval(() => {
      if (!ongoingGame) {
        clearInterval(moveInterval);
        console.log("Interval stopped on destroy.");
      }

      move();
    }, 1000);

    return score;
  }

  onDestroy(() => {
    ongoingGame = false;
  });

  startGame();
</script>

<main id="main">
  <img src={image} style={`top: ${posY}px; left: ${posX}px;`} />
</main>

<style>
  img {
    width: full;
    height: full;
    position: absolute;
  }

  main {
    height: 100vh;
    width: 100vw;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
  }
</style>
