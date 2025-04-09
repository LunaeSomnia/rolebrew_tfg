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
    Paperplane,
}

export const DEFAULT_ICON_SIZE = 24;
export const DEFAULT_ICON_HEIGHT = 24;
export const DEFAULT_ICON_VIEWPORT_WIDTH = 24;
export const DEFAULT_ICON_VIEWPORT_HEIGHT = 24;
export const DEFAULT_ICON_FILL = "red";
export const DEFAULT_ICON_FILL_RULE = "evenodd";
export const DEFAULT_ICON_CLIP_RULE = "evenodd";

type IconDefinition = {
    iconViewportSize?: number;
    isStroke?: boolean;
    d: string[];
};
export const ICON_VALUES: Map<Icon, IconDefinition> = new Map([
    [
        Icon.Logo,
        {
            isStroke: true,
            d: [
                "M16.5 9.28125L12 6.75L7.5 9.28125M16.5 9.28125V14.7188M16.5 9.28125L19.764 7.44524M16.5 14.7188L12 17.25L7.5 14.7188M16.5 14.7188L7.5 9.28125M7.5 14.7188V9.28125M7.5 14.7188L4.23598 16.5548M19.764 7.44524C18.2002 4.78536 15.3086 3 12 3C7.02944 3 3 7.02944 3 12C3 13.6619 3.45047 15.2187 4.23598 16.5548M19.764 7.44524C20.5495 8.78132 21 10.3381 21 12C21 16.9706 16.9706 21 12 21C8.69139 21 5.79976 19.2146 4.23598 16.5548"
            ],
        },
    ],
    [
        Icon.Search,
        {
            isStroke: true,
            d: [
                "M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z",
            ],
        },
    ],
    [
        Icon.Close,
        {
            isStroke: true,
            d: ["M19 5L5 19M5 5L19 19"],
        },
    ],
    [
        Icon.ChevronDown,
        {
            isStroke: true,
            d: ["M16 10L12 14L8 10"],
        },
    ],
    [
        Icon.ChevronUp,
        {
            isStroke: true,
            d: ["M8 14L12 10L16 14"],
        },
    ],
    [
        Icon.Health,
        {
            isStroke: true,
            d: ["M21 10L12 19L3 10L8 5L12 9L16 5L21 10Z"],
        },
    ],
    [
        Icon.Speed,
        {
            isStroke: true,
            d: [
                "M3.86154 21C3.99999 21 9.91984 21 11 21M11 21C6.5 18.5 12.5 16 3.5 9.5C4.48345 6.62604 8 4 8 4H12M11 21C12.7067 21 20 21 20 21L16 17M18 4L13.5 9.5L16 17M16 17L13.5 15.5",
            ],
        },
    ],
    [
        Icon.Size,
        {
            d: [
                "M4.5 12C4.5 7.85786 7.85786 4.5 12 4.5C16.1421 4.5 19.5 7.85786 19.5 12C19.5 14.2398 18.5181 16.2503 16.9614 17.6246C16.9869 17.42 17 17.2115 17 17C17 14.2386 14.7614 12 12 12C9.23858 12 7 14.2386 7 17C7 17.2115 7.01314 17.42 7.03864 17.6246C5.48185 16.2503 4.5 14.2398 4.5 12ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z",
            ],
        },
    ],
    [
        Icon.Swim,
        {
            isStroke: true,
            d: [
                "M2 3C3.10457 3 4 3.89543 4 5C4 6.10457 4.89543 7 6 7C7.10457 7 8 6.10457 8 5C8 3.89543 8.89543 3 10 3C11.1046 3 12 3.89543 12 5C12 6.10457 12.8954 7 14 7C15.1046 7 16 6.10457 16 5C16 3.89543 16.8954 3 18 3C19.1046 3 20 3.89543 20 5C20 6.10457 20.8954 7 22 7M2 10C3.10457 10 4 10.8954 4 12C4 13.1046 4.89543 14 6 14C7.10457 14 8 13.1046 8 12C8 10.8954 8.89543 10 10 10C11.1046 10 12 10.8954 12 12C12 13.1046 12.8954 14 14 14C15.1046 14 16 13.1046 16 12C16 10.8954 16.8954 10 18 10C19.1046 10 20 10.8954 20 12C20 13.1046 20.8954 14 22 14M2 17C3.10457 17 4 17.8954 4 19C4 20.1046 4.89543 21 6 21C7.10457 21 8 20.1046 8 19C8 17.8954 8.89543 17 10 17C11.1046 17 12 17.8954 12 19C12 20.1046 12.8954 21 14 21C15.1046 21 16 20.1046 16 19C16 17.8954 16.8954 17 18 17C19.1046 17 20 17.8954 20 19C20 20.1046 20.8954 21 22 21",
            ],
        },
    ],
    [
        Icon.Add,
        {
            isStroke: true,
            d: ["M11.5679 4.72021V18.7202M4.56787 11.7202H18.5679"],
        },
    ],
    [
        Icon.ChevronLeft,
        {
            isStroke: true,
            d: ["M14 16L10 12L14 8"],
        },
    ],
    [
        Icon.ChevronDown,
        {
            isStroke: true,
            d: ["M16 10L12 14L8 10"],
        },
    ],
    [
        Icon.Check,
        {
            isStroke: true,
            d: ["M20.4395 5.96631L9.43945 16.9663L4.43945 11.9663"],
        },
    ],
]);
