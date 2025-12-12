<script lang="ts">
  import { innerHeight, innerWidth } from "svelte/reactivity/window";
  import image from "../assets/svelte.svg";
  import { Direction, type Coordinate } from "./definitions";
  import { onDestroy } from "svelte";

  const height = $state(innerHeight.current);
  const width = $state(innerWidth.current);

  const { curDirection } = $props();
  let posX = $state(width / 2);
  let posY = $state(height / 2);

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

  let moveInterval: number = setInterval(() => {
    move();
  }, 1000);

  onDestroy(() => clearInterval(moveInterval));
</script>

<img src={image} style={`top: ${posY}px; left: ${posX}px;`} />

<style>
  img {
    width: full;
    height: full;
    position: absolute;
  }
</style>
