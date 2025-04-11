export function roll(max: number) {
    const roll = Math.floor(Math.random() * max) + 1;
    return roll;
}