import type { Character, Summary, Condition, Action, Class, Spell, Rule } from "$lib/bindings";
import { CharacterSimulationState } from "$lib/characterSimulator.svelte";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, data, params }) => {
    const [character, spells, equipmentSummaries, actions, conditions] = await Promise.all([
        fetch(`/api/user/${data.user.username}/character/${params.character_id}`)
            .then((v) => v.json())
            .then((v) => v as Character),

        fetch(`/api/spell`)
            .then((v) => v.json())
            .then((v) => v as Rule[]),

        fetch(`/api/equipment/summary`)
            .then((v) => v.json())
            .then((v) => v as Summary[]),

        fetch(`/api/action`)
            .then((v) => v.json())
            .then((v) => v as Action[]),

        fetch(`/api/condition`)
            .then((v) => v.json())
            .then((v) => v as Condition[]),
    ]);

    let classData = await fetch(`/api/class/${character.class}`)
        .then((v) => v.json())
        .then(v => v as Class)

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
        spells,
        classData,
        equipmentSummaries,
        conditions,
        actions,
        simulationState,
    };
};
