<script lang="ts">
  import { innerHeight, innerWidth } from "svelte/reactivity/window";
  import { onDestroy } from "svelte";
  import { Direction, type Coordinate } from "./lib/definitions";
  import Player from "./lib/Player.svelte";
  import Score from "./lib/Score.svelte";

  const height = $state(innerHeight.current);
  const width = $state(innerWidth.current);
  const playerLength = $state(height / 20);
  const initialPosX = width / 2;
  const initialPosY = height / 2;
  const POSITION_JUMP = 10;

  // Playing field boundaries
  const TOP_BOUNDARY = 0;
  const RIGHT_BOUNDARY = width;
  const LEFT_BOUNDARY = 0;
  const BOTTOM_BOUNDARY = height;

  // Game variables
  let ongoingGame: boolean = $state(true);
  let gameEnd: boolean = $state(false);
  let score: number = $state(0);
  let highScore: number | undefined = $state();

  // Player variables
  let curDirection: Direction = $state(Direction.North);
  let posX = $state(initialPosX);
  let posY = $state(initialPosY);

  function keyHandler(event: KeyboardEvent) {
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

  function checkCoordinatesWithinBounds(coordinates: Coordinate): boolean {
    if (!coordinates) {
      return false;
    } else if (coordinates.x < LEFT_BOUNDARY || coordinates.x > RIGHT_BOUNDARY - playerLength) {
      return false;
    } else if (coordinates.y < TOP_BOUNDARY || coordinates.y > BOTTOM_BOUNDARY - playerLength) {
      return false;
    }

    return true;
  }

  function calculateNewPos(x: number, y: number, direction: Direction): Coordinate {
    let coordinates: Coordinate;

    switch (direction) {
      case Direction.North:
        coordinates = { x, y: y - POSITION_JUMP };
        break;
      case Direction.East:
        coordinates = { x: x + POSITION_JUMP, y };
        break;
      case Direction.South:
        coordinates = { x, y: y + POSITION_JUMP };
        break;
      case Direction.West:
        coordinates = { x: x - POSITION_JUMP, y };
        break;
      default:
        throw new Error("Unknown direction used to calculate new position.");
    }

    return coordinates;
  }

  function move(): void {
    const coordinates = calculateNewPos(posX, posY, curDirection);

    // TODO: collision detection

    const coordinatesWithinBounds: boolean = checkCoordinatesWithinBounds(coordinates);
    if (!coordinatesWithinBounds) {
      gameOver();
    }

    posX = coordinates.x;
    posY = coordinates.y;
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

  function gameOver() {
    gameEnd = true;
    ongoingGame = false;

    if (!highScore || score > highScore) {
      highScore = score;
    }
  }

  onDestroy(() => {
    ongoingGame = false;
  });

  startGame();
</script>

<main id="main">
  <Score {score} {highScore} />
  <Player {posX} {posY} length={playerLength ?? 50} />
  <!-- TODO: add obstacles to the map -->
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
