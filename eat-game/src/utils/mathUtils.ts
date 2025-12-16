export function getRandomInteger(min: number, max: number): number {
    const randomMultiplier = Math.random();
    const difference: number = max - min;
    return (difference * randomMultiplier) + min;
}