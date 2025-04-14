import type { Character, Skill } from "./bindings"
import { BASIC_SKILL_TO_ATTRIBUTE, proficiencyBonus, scoreToModifier } from "./components/character-creator/characterCreator.svelte"
import { roll } from "./roll";

export class CharacterSimulationState {
    character: Character;

    hp: number = $state(0)
    tempHp: number = $state(0)

    heroPoints: number = $state(0)

    armorClass: number = $derived.by(() => {
        let base = 10;

        console.log(this.character.armorProficiencies, this.currentArmor)

        if (this.currentArmor === 'Unarmored') {
            base += proficiencyBonus(this.character.armorProficiencies.unarmored, this.character.level)
        }

        return base
    })
    currentArmor: string = $state('Unarmored')
    hasShieldUp: boolean = $state(false)
    currentShield: string | undefined = $state(undefined)

    initiative: number | undefined = $state(undefined)

    chat: string[] = $state([])

    constructor(character: Character) {
        this.character = character

        this.hp = this.character.hp
    }

    rollInitiative(skill: Skill) {
        this.initiative = roll(20) + proficiencyBonus(this.character.skills[skill], this.character.level)
        this.pushChatMessage('rolled iniciative: ' + this.initiative)
    }

    pushChatMessage(msg: string) {
        this.chat.push(msg)
    }
}