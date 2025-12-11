<script lang="ts">
    import { innerHeight, innerWidth } from "svelte/reactivity/window";
  import image from "./assets/svelte.svg";
  let img: HTMLImageElement | undefined = $state();

  const height = $state(innerHeight.current);
  const width = $state(innerWidth.current);

  let posX = $state(height / 2);
  let posY = $state(width / 2);``
</script>

<main id="main">
  <img src={image} style={`top: ${posX}px; left: ${posY}px;`} />
</main>

<style>
  main {
    height: 100vh;
    width: 100vw;
  }

  img {
    width: full;
    height: full;
    position: absolute;
  }
</style>
