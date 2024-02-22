'use client';

import * as util from './util';
import * as w from './weapon';
import * as a from './armor';

class Character {
	id;
	name;
	playerId;
	level;
	race;
	subRace;
	strength;
	dexterity;
	constitution;
	intelligence;
	wisdom;
	charisma;
	maxHp;
	attack;
	status;
	weapons;
	armors;
	constructor(
		id,
		name,
		{
			playerId = null,
			level = 1,
			race = 'human',
			subRace = null,
			strength = null,
			dexterity = null,
			constitution = null,
			intelligence = null,
			wisdom = null,
			charisma = null,
			maxHp = null,
			hp = null,
			status = null,
			weapons = new w.Shortsword(),
			armors = [new a.Hide()],
			initiative = null,
		} = {},
	) {
		this.id = id;

		// We'll use this playerId to manage who controls the character in the game
		// For now: 1 will note the player, and 0 will note that AI controls the character
		this.playerId = playerId;
		this.name = name;
		this.level = level;

		this.race = race;
		this.subRace = subRace;

		this.strength =
			strength || parseInt(util.dropLow(4, 6)) + this.raceMod(race, 'strength') + this.subRaceMod(subRace, 'strength');
		this.strengthMod = Math.floor((this.strength - 10) / 2);

		this.dexterity =
			dexterity ||
			parseInt(util.dropLow(4, 6)) + this.raceMod(race, 'dexterity') + this.subRaceMod(subRace, 'dexterity');
		this.dexterityMod = Math.floor((this.dexterity - 10) / 2);

		this.constitution =
			constitution ||
			parseInt(util.dropLow(4, 6)) + this.raceMod(race, 'constitution') + this.subRaceMod(subRace, 'constitution');
		this.constitutionMod = Math.floor((this.constitution - 10) / 2);

		this.intelligence =
			intelligence ||
			parseInt(util.dropLow(4, 6)) + this.raceMod(race, 'intelligence') + this.subRaceMod(subRace, 'intelligence');
		this.intelligenceMod = Math.floor((this.intelligence - 10) / 2);

		this.wisdom =
			wisdom || parseInt(util.dropLow(4, 6)) + this.raceMod(race, 'wisdom') + this.subRaceMod(subRace, 'wisdom');
		this.wisdomMod = Math.floor((this.wisdom - 10) / 2);

		this.charisma =
			charisma || parseInt(util.dropLow(4, 6)) + this.raceMod(race, 'charisma') + this.subRaceMod(subRace, 'charisma');
		this.charismaMod = Math.floor((this.charisma - 10) / 2);

		this.maxHp = maxHp || 10 + this.raceMod(race, 'maxHp') + this.subRaceMod(subRace, 'maxHp') + this.constitutionMod;
		this.hp = hp || maxHp;

		// If weapons is an instance of Weapon class then assign it to this.weapons
		if (weapons instanceof w.Weapon) {
			this.weapons = weapons;
		}
		// If the weapons object has an objectClassName property
		// then convert the weapons object into a subclass of the Weapon class.
		else if (weapons.objectClassName) {
			const weaponClass = w[weapons.objectClassName];

			if (weaponClass && weaponClass.prototype instanceof w.Weapon) {
				this.weapons = new weaponClass();
			}
		}

		// Need to make sure armors argument contains Armor class objects.
		// If not, the simple objects need to be converted.
		const armorsAsArmors = armors.map((armor) => {
			let tempArmor;
			// If armor is an instanceof Armor class then return it to the armorsAsArmors array.
			if (armor instanceof a.Armor) {
				tempArmor = armor;
			}
			// If the armor object has an objectClassName property,
			// then convert the armor object into a subclass of the Armor class.
			else if (armor.objectClassName) {
				// Get the name of the Armor class from the objectClassName property.
				const armorClassName = a[armor.objectClassName];

				// If the armorClassName is not null and there's a prototype for it in the
				// armor.js file, then create a new tempArmor to get returned.
				if (armorClassName && armorClassName.prototype instanceof a.Armor) {
					tempArmor = new armorClassName();
				}
			}
			return tempArmor;
		});

		this.armors = armorsAsArmors;
		this.armorClass = this.calcArmorClass();
		this.status = status || [];

		// initiative will determine the order of turns during combat
		// Roll 1d20 to get raw initiative, then add dexterityMod
		//
		// For now, we can set initiative here. Long term, we'll need to pull
		// this out and roll for initiative at the beginning of each fight.
		// this.initiative = parseInt(util.rollDice(1, 20)) + parseInt(this.dexterityMod);
		this.initiative = initiative || 0;
	}

	raceMod(race, ability) {
		if (race === 'dragonborn') {
			return ability === 'strength' ? 2 : ability === 'charisma' ? 1 : 0;
		}
		if (race === 'dwarf') {
			return ability === 'constitution' ? 2 : 0;
		} else if (race === 'elf') {
			return ability === 'dexterity' ? 2 : 0;
		} else if (race === 'gnome') {
			return ability === 'intelligence' ? 2 : 0;
		} else if (race === 'halfling') {
			return ability === 'dexterity' ? 2 : 0;
		} else if (race === 'human') {
			return ability !== 'maxHp' ? 1 : 0;
		} else if (race === 'half-elf') {
			return ability === 'charisma' ? 2 : 0; // Need to figure out how to handle +1 ability score to users choice of ability
		} else if (race === 'half-orc') {
			return ability === 'strength' ? 2 : ability === 'constitution' ? 1 : 0;
		} else if (race === 'tiefling') {
			return ability === 'charisma' ? 2 : ability === 'intelligence' ? 1 : 0;
		}
	}

	subRaceMod(subRace, ability) {
		if (subRace === 'dark elf') {
			return ability === 'charisma' ? 1 : 0;
		} else if (subRace === 'forest gnome') {
			return ability === 'dexterity' ? 1 : 0;
		} else if (subRace === 'high elf') {
			return ability === 'intelligence' ? 1 : 0;
		} else if (subRace === 'hill dwarf') {
			return ability === 'wisdom' || ability === 'maxHp' ? 1 : 0;
		} else if (subRace === 'lightfoot halfling') {
			return ability === 'charisma' ? 1 : 0;
		} else if (subRace === 'mountain dwarf') {
			return ability === 'strength' ? 2 : 0;
		} else if (subRace === 'rock gnome') {
			return ability === 'consitution' ? 1 : 0;
		} else if (subRace === 'stout halfling') {
			return ability === 'consitution' ? 1 : 0;
		} else if (subRace === 'wood elf') {
			return ability === 'wisdom' ? 1 : 0;
		} else {
			return 0;
		}
	}

	calcArmorClass() {
		let ac = 0;
		this.armors.forEach((armor) => {
			let dexMod = 0;
			if (armor.dexMod === 'full') {
				dexMod = this.dexterityMod;
			} else if (armor.dexMod === 2) {
				dexMod = this.dexterityMod > 2 ? 2 : this.dexterityMod;
			} else if (armor.dexMod === null) {
				dexMod = 0;
			}

			ac += armor.armorClass + dexMod;
		});
		return ac;
	}

	get armorNames() {
		return this.armors !== null ? this.armors.map((armor) => armor.name).join(', ') : '';
	}
}

export default Character;
