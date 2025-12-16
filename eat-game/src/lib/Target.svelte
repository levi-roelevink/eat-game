<script lang="ts">
    import image from "../assets/svelte.svg";
    let { x, y, length } = $props();
</script>

<img src={image} alt="Eat this target" style={`top: ${y}px; left: ${x}px; width: ${length}px; height: ${length}px;`} />

<style>
    img {
        position: absolute;
    }
</style>
