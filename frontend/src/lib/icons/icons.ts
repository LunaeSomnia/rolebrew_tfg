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
    PLay,
    Dice,
    Undo,
    Redo,
    ChevronRight,
    ChevronDown,
    ChevronLeft,
    ChevronUp,
    Size,
    Speed,
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
    }]
])

