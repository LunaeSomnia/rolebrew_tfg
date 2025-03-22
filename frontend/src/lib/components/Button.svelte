<script lang="ts">
    let { children, ...props } = $props();
</script>

<button {...props}>
    {@render children()}
</button>

<style lang="scss">
    @use "sass:color";
    @use "/static/colors.scss";

    button {
        height: fit-content;
        position: relative;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        font-weight: bold;
        color: var(--dark-1);
        cursor: pointer;
        font-size: 1rem;

        $bg-color: colors.$orange;
        background-color: $bg-color;

        &:hover {
            background-color: color.adjust($bg-color, $lightness: 15%);
        }

        &.disabled {
            cursor: none;
            pointer-events: none;
            opacity: 50%;
        }

        &.secondary {
            $bg-color: colors.$dark-3;
            background-color: var(--dark-3);
            color: var(--light-1);

            &:hover {
                background-color: color.adjust($bg-color, $lightness: 15%);
            }
        }

        &.ghost {
            $bg-color: colors.$dark-2;
            background-color: initial;
            color: var(--light-1);
            padding: 0;

            &:hover {
                background-color: color.adjust($bg-color, $lightness: 15%);
            }
        }
    }
</style>
