<script lang="ts">
  import image from "../assets/svelte.svg";

  let {posX, posY, length }: {posX: number; posY: number; length: number;} = $props();
</script>

<img id="image" src={image} alt="Player" style={`top: ${posY}px; left: ${posX}px; height: ${length}px; width: ${length}px;`} />

<style>
  img {
    position: absolute;
  }
</style>
