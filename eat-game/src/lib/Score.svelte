<script lang="ts">
    let { score, highScore } = $props<{ score: number; highScore: number | undefined }>();
</script>

<div class="score-container">
    <div class="current-score">SCORE: {score}</div>
    {#if highScore}
        <div>HIGH SCORE: {highScore}</div>
    {/if}
</div>

<style>
    .score-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 1rem;
    }
</style>
