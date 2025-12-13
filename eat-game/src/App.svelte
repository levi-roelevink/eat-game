<script lang="ts">
  import { innerHeight, innerWidth } from "svelte/reactivity/window";
  import { onDestroy } from "svelte";
  import { Direction, type Coordinate } from "./lib/definitions";
  import Player from "./lib/Player.svelte";

  const height = $state(innerHeight.current);
  const width = $state(innerWidth.current);

  const TOP_BOUNDARY = 0;
  const RIGHT_BOUNDARY = width;
  const LEFT_BOUNDARY = 0;
  const BOTTOM_BOUNDARY = height;

  // Game variables
  let ongoingGame: boolean = $state(true);
  let score: number = 0;

  // Player variables
  let curDirection: Direction = $state(Direction.North);
  let posX = $state(width / 2);
  let posY = $state(height / 2);

  let imgLengthPx = $derived.by(() => document.getElementById("image").clientHeight);

  $effect(() => {
    console.log("imgLengthPx", imgLengthPx);
    console.log("height", height);
  });

  function keyHandler(event) {
    const keyName = event.key;

    switch (keyName) {
      case "ArrowUp":
        curDirection = Direction.North;
        break;
      case "ArrowRight":
        curDirection = Direction.East;
        break;
      case "ArrowDown":
        curDirection = Direction.South;
        break;
      case "ArrowLeft":
        curDirection = Direction.West;
        break;
    }
  }

  function calculateNewPos(x: number, y: number, direction: Direction): Coordinate {
    let coordinates: Coordinate;

    switch (direction) {
      case Direction.North:
        coordinates = { x, y: y - 10 };
        break;
      case Direction.East:
        coordinates = { x: x + 10, y };
        break;
      case Direction.South:
        coordinates = { x, y: y + 10 };
        break;
      case Direction.West:
        coordinates = { x: x - 10, y };
        break;
      default:
        throw new Error("Unknown direction used to calculate new position.");
    }

    return coordinates;
  }

  function move(): void {
    const { x, y } = calculateNewPos(posX, posY, curDirection);
    console.log(`x: ${x}, y: ${y}`);
    posX = x;
    posY = y;
  }

  function startGame(): number {
    document.addEventListener("keydown", (event) => keyHandler(event));

    const scoreInterval: number = setInterval(() => {
      if (!ongoingGame) {
        clearInterval(scoreInterval);
        console.log("Interval stopped on destroy.");
      }

      move();
      score++;
    }, 1000);

    return score;
  }

  onDestroy(() => {
    ongoingGame = false;
  });

  startGame();
</script>

<main id="main">
  <Player {posX} {posY} length={(height / 20) ?? 50} />
</main>

<style>
  main {
    height: 100vh;
    width: 100vw;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
  }
</style>
