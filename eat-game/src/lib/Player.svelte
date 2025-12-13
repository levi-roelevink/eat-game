<script lang="ts">
  import { innerHeight, innerWidth } from "svelte/reactivity/window";
  import image from "../assets/svelte.svg";

  const wHeight = $state(innerHeight.current);
  const wWidth = $state(innerWidth.current);

  let imgLengthPx = $derived(() => document.getElementById("image").clientHeight);

  let {posX, posY } = $props();
</script>

<img
  id="image"
  src={image}
  style={`top: ${posY}px; left: ${posX}px; height: ${wHeight / 20}px; width: ${wWidth / 20}px;`}
/>

<style>
  img {
    position: absolute;
  }
</style>
