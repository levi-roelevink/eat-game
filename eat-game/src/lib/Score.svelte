<script lang="ts">
    let { score } = $props<{ score: number }>();
</script>

<div class="current-score">Score: {score}</div>

<style>
    .current-score {
        display: flex;
        padding: 1rem;
    }
</style>
