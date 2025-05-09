import type { Character, Summary, Condition, Action } from "$lib/bindings";
import { CharacterSimulationState } from "$lib/characterSimulator.svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, data, params }) => {
    let character = await fetch(
        `/api/user/${data.user.username}/character/${params.character_id}`,
    )
        .then((v) => v.json())
        .then((v) => v as Character);

    let equipmentSummaries = await fetch("/api/equipment/summary")
        .then((v) => v.json())
        .then((v) => v as Summary[]);

    let actions = await fetch("/api/action")
        .then((v) => v.json())
        .then((v) => v as Action[]);

    let conditions = await fetch("/api/condition")
        .then((v) => v.json())
        .then((v) => v as Condition[]);

    let simulationState;
    if (character.state !== undefined && character.state !== null) {
        simulationState = CharacterSimulationState.fromPreviousState(
            character,
            character.state as any,
        );
    } else {
        simulationState = new CharacterSimulationState(character, conditions);
    }

    return {
        character,
        equipmentSummaries,
        conditions,
        actions,
        simulationState,
    };
};
