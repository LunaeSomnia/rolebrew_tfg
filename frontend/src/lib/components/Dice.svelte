<script lang="ts">
    let {
        dice,
        excluded = false,
    }: {
        dice: number;
        excluded?: boolean;
    } = $props();

    let lighter = $derived(excluded ? "var(--red-lighter)" : "var(--light-1)");
    let darker = $derived(excluded ? "var(--red-darker)" : "var(--light-2)");
</script>

<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {#if dice === 4}
        <g clip-path="url(#clip0_1309_24397)">
            <path d="M24 0L0 48H48L24 0Z" fill={darker} />
        </g>
        <defs>
            <clipPath id="clip0_1309_24397">
                <rect width="48" height="48" fill="white" />
            </clipPath>
        </defs>
    {:else if dice === 6}
        <g clip-path="url(#clip0_1309_24399)">
            <rect width="48" height="48" fill={darker} />
        </g>
        <defs>
            <clipPath id="clip0_1309_24399">
                <rect width="48" height="48" fill="white" />
            </clipPath>
        </defs>
    {:else if dice === 8}
        <g clip-path="url(#clip0_1309_24401)">
            <path
                d="M24 0L44.7846 12V36L24 48L3.21539 36V12L24 0Z"
                fill={lighter}
            />
            <path d="M24 48L44.7846 12H3.21539L24 48Z" fill={darker} />
        </g>
        <defs>
            <clipPath id="clip0_1309_24401">
                <rect width="48" height="48" fill="white" />
            </clipPath>
        </defs>
    {:else if dice === 12}
        <g clip-path="url(#clip0_1309_24407)">
            <path
                d="M24 0L38.1068 4.58359L46.8254 16.5836V31.4164L38.1068 43.4164L24 48L9.89315 43.4164L1.17464 31.4164V16.5836L9.89315 4.58359L24 0Z"
                fill={lighter}
            />
            <path
                d="M24 0L46.8254 16.5836L38.1068 43.4164H9.89315L1.17464 16.5836L24 0Z"
                fill={darker}
            />
        </g>
        <defs>
            <clipPath id="clip0_1309_24407">
                <rect width="48" height="48" fill="white" />
            </clipPath>
        </defs>
    {:else if dice === 20}
        <g clip-path="url(#clip0_1309_24404)">
            <path
                d="M24 0L44.7846 12V36L24 48L3.21539 36V12L24 0Z"
                fill={lighter}
            />
            <path d="M24 12L34.3923 30H13.6077L24 12Z" fill={darker} />
        </g>
        <defs>
            <clipPath id="clip0_1309_24404">
                <rect width="48" height="48" fill="white" />
            </clipPath>
        </defs>
    {:else if dice === 100}
        <g clip-path="url(#clip0_1309_24410)">
            <path d="M24 0L48 24L24 48L0 24L24 0Z" fill={lighter} />
            <path d="M24 0L36.1244 29.25H11.8756L24 0Z" fill={darker} />
        </g>
        <defs>
            <clipPath id="clip0_1309_24410">
                <rect width="48" height="48" fill="white" />
            </clipPath>
        </defs>
    {/if}
</svg>

<style lang="scss">
    svg {
        width: 2.5rem;
        height: 2.5rem;
    }
</style>
