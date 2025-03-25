export enum Icon {
    Logo,
    Search,
    Close,
    Filter,
    FilterOff,
    FreeAction,
    Action,
    DoubleAction,
    TripleAction,
    User,
    Settings,
    Exit,
    Users,
    Screen,
    Help,
    Mail,
    Locked,
    Unlocked,
    EyeOff,
    Eye,
    Bell,
    Add,
    Pencil,
    Play,
    Dice,
    Undo,
    Redo,
    ChevronRight,
    ChevronDown,
    ChevronLeft,
    ChevronUp,
    Size,
    Speed,
    Swim,
    Check,
    Refresh,
    Upload,
    Armor,
    Health,
    Reaction,
    Scroll,
    Book,
    ArrowRight,
    DragHandle,
    Math,
    Shield,
    Initiative,
    Cloth,
    At,
    Pound,
    Textbox,
    Stat,
    Paperplane
}

export const DEFAULT_ICON_SIZE = 24
export const DEFAULT_ICON_HEIGHT = 24
export const DEFAULT_ICON_VIEWPORT_WIDTH = 24;
export const DEFAULT_ICON_VIEWPORT_HEIGHT = 24;
export const DEFAULT_ICON_FILL = "red"
export const DEFAULT_ICON_FILL_RULE = "evenodd";
export const DEFAULT_ICON_CLIP_RULE = "evenodd"


type IconDefinition = {
    iconViewportSize?: number,
    isStroke?: boolean,
    d: string[]
}
export const ICON_VALUES: Map<Icon, IconDefinition> = new Map([
    [Icon.Logo, {
        iconViewportSize: 32,
        d: [
            "M16 5C9.92487 5 5 9.92487 5 16C5 17.6825 5.3771 19.2748 6.05103 20.699L9 19.0402V11.7902L16 7.85265L22 11.2277L24.9321 9.57834C22.9338 6.80376 19.6771 5 16 5ZM25.949 11.3011L23 12.9598V20.2098L16 24.1473L10 20.7723L7.06788 22.4217C9.06623 25.1962 12.3229 27 16 27C22.0751 27 27 22.0751 27 16C27 14.3175 26.6229 12.7252 25.949 11.3011ZM11 19.0402L16 21.8527L20.0151 19.5941L11 14.1475V19.0402ZM11.9849 12.4059L21 17.8525V12.9598L16 10.1473L11.9849 12.4059ZM3 16C3 8.8203 8.8203 3 16 3C20.7803 3 24.9568 5.58074 27.2141 9.42017C28.3493 11.351 29 13.601 29 16C29 23.1797 23.1797 29 16 29C11.2197 29 7.04318 26.4193 4.78592 22.5798C3.65072 20.649 3 18.399 3 16Z"
        ]
    }],
    [Icon.Search, {
        isStroke: true,
        d: [
            "M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
        ]
    }],
    [Icon.Close, {
        isStroke: true,
        d: [
            "M19 5L5 19M5 5L19 19"
        ]
    }],
    [Icon.ChevronDown, {
        isStroke: true,
        d: [
            "M16 10L12 14L8 10"
        ]
    }],
    [Icon.ChevronUp, {
        isStroke: true,
        d: [
            "M8 14L12 10L16 14"
        ]
    }],
    [Icon.Health, {
        isStroke: true,
        d: [
            "M21 10L12 19L3 10L8 5L12 9L16 5L21 10Z"
        ]
    }],
    [Icon.Speed, {
        isStroke: true,
        d: [
            "M3.86154 21C3.99999 21 9.91984 21 11 21M11 21C6.5 18.5 12.5 16 3.5 9.5C4.48345 6.62604 8 4 8 4H12M11 21C12.7067 21 20 21 20 21L16 17M18 4L13.5 9.5L16 17M16 17L13.5 15.5"
        ]
    }],
    [Icon.Size, {
        d: [
            "M4.5 12C4.5 7.85786 7.85786 4.5 12 4.5C16.1421 4.5 19.5 7.85786 19.5 12C19.5 14.2398 18.5181 16.2503 16.9614 17.6246C16.9869 17.42 17 17.2115 17 17C17 14.2386 14.7614 12 12 12C9.23858 12 7 14.2386 7 17C7 17.2115 7.01314 17.42 7.03864 17.6246C5.48185 16.2503 4.5 14.2398 4.5 12ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        ]
    }],
    [Icon.Swim, {
        isStroke: true,
        d: [
            "M2 3C3.10457 3 4 3.89543 4 5C4 6.10457 4.89543 7 6 7C7.10457 7 8 6.10457 8 5C8 3.89543 8.89543 3 10 3C11.1046 3 12 3.89543 12 5C12 6.10457 12.8954 7 14 7C15.1046 7 16 6.10457 16 5C16 3.89543 16.8954 3 18 3C19.1046 3 20 3.89543 20 5C20 6.10457 20.8954 7 22 7M2 10C3.10457 10 4 10.8954 4 12C4 13.1046 4.89543 14 6 14C7.10457 14 8 13.1046 8 12C8 10.8954 8.89543 10 10 10C11.1046 10 12 10.8954 12 12C12 13.1046 12.8954 14 14 14C15.1046 14 16 13.1046 16 12C16 10.8954 16.8954 10 18 10C19.1046 10 20 10.8954 20 12C20 13.1046 20.8954 14 22 14M2 17C3.10457 17 4 17.8954 4 19C4 20.1046 4.89543 21 6 21C7.10457 21 8 20.1046 8 19C8 17.8954 8.89543 17 10 17C11.1046 17 12 17.8954 12 19C12 20.1046 12.8954 21 14 21C15.1046 21 16 20.1046 16 19C16 17.8954 16.8954 17 18 17C19.1046 17 20 17.8954 20 19C20 20.1046 20.8954 21 22 21"
        ]
    }]
])

