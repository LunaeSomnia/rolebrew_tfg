export const userState: UserState = $state({
    username: null
})

export interface UserState {
    username: string | null
}