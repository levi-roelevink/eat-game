<script lang="ts">
  import { innerHeight, innerWidth } from "svelte/reactivity/window";
  import { onDestroy } from "svelte";
  import { Direction, type Coordinate } from "./lib/definitions";
  import Player from "./lib/Player.svelte";
  import Score from "./lib/Score.svelte";
  import Target from "./lib/Target.svelte";
  import { getRandomInteger } from "./utils/mathUtils";

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

  // Movement variables
  let curDirection: Direction = $state(Direction.North);
  let playerCoordinates: Coordinate = $state({ x: initialPosX, y: initialPosY });
  let targetCoordinates: Coordinate = $state({ x: 0, y: 0 });

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

  function calculateNewPos(c: Coordinate, direction: Direction): Coordinate {
    let coordinates: Coordinate;

    switch (direction) {
      case Direction.North:
        coordinates = { x: c.x, y: c.y - POSITION_JUMP };
        break;
      case Direction.East:
        coordinates = { x: c.x + POSITION_JUMP, y: c.y };
        break;
      case Direction.South:
        coordinates = { x: c.x, y: c.y + POSITION_JUMP };
        break;
      case Direction.West:
        coordinates = { x: c.x - POSITION_JUMP, y: c.y };
        break;
      default:
        throw new Error("Unknown direction used to calculate new position.");
    }

    return coordinates;
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

  function checkCollision(player: Coordinate, target: Coordinate): boolean {
    const xDistance = player.x - target.x;
    if (xDistance >= -playerLength && xDistance <= playerLength) {
      // player's position on the x-axis overlaps with that of the target

      const yDistance = player.y - target.y;
      if (yDistance >= -playerLength && yDistance <= playerLength) {
        // player's position on the y-axis also overlaps with that of the target
        return true;
      }
    }

    return false;
  }

  function move(): void {
    const coordinates = calculateNewPos(playerCoordinates, curDirection);
    playerCoordinates = coordinates;

    const collision: boolean = checkCollision(playerCoordinates, targetCoordinates);
    if (collision) {
      score++;
      // TODO: new target
    }

    const coordinatesWithinBounds: boolean = checkCoordinatesWithinBounds(coordinates);
    if (!coordinatesWithinBounds) {
      gameOver();
    }
  }

  function startGame(): number {
    document.addEventListener("keydown", (event) => keyHandler(event));

    // Set initial target position
    targetCoordinates = getRandomCoordinates();

    const scoreInterval: number = setInterval(() => {
      if (!ongoingGame) {
        clearInterval(scoreInterval);
        console.log("Interval stopped on destroy.");
      }

      move();
    }, 250);

    return score;
  }

  function gameOver() {
    gameEnd = true;
    ongoingGame = false;

    if (!highScore || score > highScore) {
      highScore = score;
    }
  }

  function getRandomCoordinates(): Coordinate {
    let coordinates: Coordinate;
    const x = getRandomInteger(LEFT_BOUNDARY, RIGHT_BOUNDARY - playerLength);
    const y = getRandomInteger(TOP_BOUNDARY, BOTTOM_BOUNDARY - playerLength);

    coordinates = { x, y };
    return coordinates;
  }

  onDestroy(() => {
    ongoingGame = false;
  });

  startGame();
</script>

<main id="main">
  <Score {score} {highScore} />
  <Player posX={playerCoordinates.x} posY={playerCoordinates.y} length={playerLength ?? 50} />
  <Target x={targetCoordinates.x} y={targetCoordinates.y} length={playerLength ?? 50} />
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
