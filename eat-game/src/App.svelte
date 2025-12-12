<script lang="ts">
  import { innerHeight, innerWidth } from "svelte/reactivity/window";
  import { onDestroy } from "svelte";
  import { Direction } from "./lib/definitions";
  import Player from "./lib/Player.svelte";

  let curDirection: Direction = $state(Direction.North);
  let ongoingGame: boolean = $state(true);
  let score: number = 0;

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

  function startGame(): number {
    document.addEventListener("keydown", (event) => keyHandler(event));

    const scoreInterval: number = setInterval(() => {
      if (!ongoingGame) {
        clearInterval(scoreInterval);
        console.log("Interval stopped on destroy.");
      }

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
  <Player {curDirection} />
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
