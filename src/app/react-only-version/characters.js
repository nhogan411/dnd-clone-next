'use client';

import Character from './character';
import * as w from './weapon';
import * as a from './armor';

export const rowan = new Character(1, 'Rowan', {
	playerId: 1,
	armors: [new a.Leather(), new a.Shield()],
});

export const larry = new Character(2, 'Larry', {
	playerId: 0,
});

export const ben = new Character(3, 'Ben', {
	playerId: 0,
});

export const nick = new Character(4, 'Nick', {
	playerId: 1,
});

export const michelle = new Character(5, 'Michelle', {
	playerId: 1,
});

export const nightcrawler = new Character(6, 'Nightcrawler', {
	playerId: 1,
	race: 'elf',
	subRace: 'dark elf',
	strength: 10,
	dexterity: 17,
	constitution: 12,
	intelligence: 8,
	wisdom: 14,
	charisma: 14,
	weapons: new w.Scimitar(),
});

export const wolverine = new Character(7, 'Wolverine', {
	playerId: 1,
	race: 'dwarf',
	subRace: 'mountain dwarf',
	strength: 16,
	dexterity: 14,
	constitution: 16,
	intelligence: 9,
	wisdom: 13,
	charisma: 8,
});

export const x23 = new Character(8, 'X-23', {
	playerId: 1,
	race: 'halfling',
	subRace: 'stout halfling',
	strength: 13,
	dexterity: 16,
	constitution: 16,
	intelligence: 9,
	wisdom: 13,
	charisma: 8,
});

export const sabretooth = new Character(9, 'Sabretooth', {
	playerId: 0,
	race: 'half-orc',
	strength: 10,
	dexterity: 15,
	constitution: 16,
	intelligence: 8,
	wisdom: 15,
	charisma: 8,
	weapons: new w.Greatsword(),
});

export const juggernaut = new Character(10, 'Juggernaut', {
	playerId: 0,
	race: 'dwarf',
	subRace: 'hill dwarf',
	strength: 16,
	dexterity: 10,
	constitution: 16,
	intelligence: 8,
	wisdom: 15,
	charisma: 8,
});

export const bishop = new Character(11, 'Bishop', {
	playerId: 1,
	race: 'half-orc',
	strength: 8,
	dexterity: 15,
	constitution: 17,
	intelligence: 16,
	wisdom: 10,
	charisma: 8,
});

export const magneto = new Character(12, 'Magneto', {
	playerId: 0,
	race: 'human',
	strength: 8,
	dexterity: 16,
	constitution: 16,
	intelligence: 16,
	wisdom: 8,
	charisma: 8,
});
