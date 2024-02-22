'use client';

export class Armor {
	constructor({ name, type, cost, costUnit = 'gp', weight, strength, stealth, armorClass, dexMod }) {
		this.name = name;
		this.type = type;
		this.cost = cost;
		this.costUnit = costUnit;
		this.weight = weight;
		this.strength = strength;
		this.stealth = stealth;
		this.armorClass = armorClass;
		this.dexMod = dexMod;
	}

	toJSON() {
		return {
			objectClassName: this.name,
			...this,
		};
	}
}

export class Padded extends Armor {
	constructor(
		name = 'Padded',
		type = 'light',
		cost = 5,
		weight = '8lb',
		strength = null,
		stealth = 'disadvantage',
		armorClass = 11,
		dexMod = 'full',
	) {
		super({
			name: name,
			type: type,
			cost: cost,
			weight: weight,
			strength: strength,
			stealth: stealth,
			armorClass: armorClass,
			dexMod: dexMod,
		});
	}
}

export class Leather extends Armor {
	constructor(
		name = 'Leather',
		type = 'light',
		cost = 10,
		weight = '10lb',
		strength = null,
		stealth = null,
		armorClass = 11,
		dexMod = 'full',
	) {
		super({
			name: name,
			type: type,
			cost: cost,
			weight: weight,
			strength: strength,
			stealth: stealth,
			armorClass: armorClass,
			dexMod: dexMod,
		});
	}
}

export class StuddedLeather extends Armor {
	constructor(
		name = 'Studded Leather',
		type = 'light',
		cost = 45,
		weight = '13lb',
		strength = null,
		stealth = null,
		armorClass = 12,
		dexMod = 'full',
	) {
		super({
			name: name,
			type: type,
			cost: cost,
			weight: weight,
			strength: strength,
			stealth: stealth,
			armorClass: armorClass,
			dexMod: dexMod,
		});
	}
}

export class Hide extends Armor {
	constructor(
		name = 'Hide',
		type = 'medium',
		cost = 10,
		weight = '12lb',
		strength = null,
		stealth = null,
		armorClass = 12,
		dexMod = 2,
	) {
		super({
			name: name,
			type: type,
			cost: cost,
			weight: weight,
			strength: strength,
			stealth: stealth,
			armorClass: armorClass,
			dexMod: dexMod,
		});
	}
}

export class ChainShirt extends Armor {
	constructor(
		name = 'Chain Shirt',
		type = 'medium',
		cost = 50,
		weight = '20lb',
		strength = null,
		stealth = null,
		armorClass = 13,
		dexMod = 2,
	) {
		super({
			name: name,
			type: type,
			cost: cost,
			weight: weight,
			strength: strength,
			stealth: stealth,
			armorClass: armorClass,
			dexMod: dexMod,
		});
	}
}

export class ScaleMail extends Armor {
	constructor(
		name = 'Scale Mail',
		type = 'medium',
		cost = 50,
		weight = '45lb',
		strength = null,
		stealth = 'disadvantage',
		armorClass = 14,
		dexMod = 2,
	) {
		super({
			name: name,
			type: type,
			cost: cost,
			weight: weight,
			strength: strength,
			stealth: stealth,
			armorClass: armorClass,
			dexMod: dexMod,
		});
	}
}

export class BreastPlate extends Armor {
	constructor(
		name = 'Breast Plate',
		type = 'medium',
		cost = 400,
		weight = '20lb',
		strength = null,
		stealth = null,
		armorClass = 14,
		dexMod = 2,
	) {
		super({
			name: name,
			type: type,
			cost: cost,
			weight: weight,
			strength: strength,
			stealth: stealth,
			armorClass: armorClass,
			dexMod: dexMod,
		});
	}
}

export class HalfPlate extends Armor {
	constructor(
		name = 'Half Plate',
		type = 'medium',
		cost = 750,
		weight = '40lb',
		strength = null,
		stealth = 'disadvantage',
		armorClass = 15,
		dexMod = 2,
	) {
		super({
			name: name,
			type: type,
			cost: cost,
			weight: weight,
			strength: strength,
			stealth: stealth,
			armorClass: armorClass,
			dexMod: dexMod,
		});
	}
}

export class RingMail extends Armor {
	constructor(
		name = 'Ring Mail',
		type = 'heavy',
		cost = 30,
		weight = '40lb',
		strength = null,
		stealth = 'disadvantage',
		armorClass = 14,
		dexMod = null,
	) {
		super({
			name: name,
			type: type,
			cost: cost,
			weight: weight,
			strength: strength,
			stealth: stealth,
			armorClass: armorClass,
			dexMod: dexMod,
		});
	}
}

export class ChainMail extends Armor {
	constructor(
		name = 'Chain Mail',
		type = 'heavy',
		cost = 75,
		weight = '55lb',
		strength = 13,
		stealth = 'disadvantage',
		armorClass = 16,
		dexMod = null,
	) {
		super({
			name: name,
			type: type,
			cost: cost,
			weight: weight,
			strength: strength,
			stealth: stealth,
			armorClass: armorClass,
			dexMod: dexMod,
		});
	}
}

export class Splint extends Armor {
	constructor(
		name = 'Splint',
		type = 'heavy',
		cost = 200,
		weight = '60lb',
		strength = 15,
		stealth = 'disadvantage',
		armorClass = 17,
		dexMod = null,
	) {
		super({
			name: name,
			type: type,
			cost: cost,
			weight: weight,
			strength: strength,
			stealth: stealth,
			armorClass: armorClass,
			dexMod: dexMod,
		});
	}
}

export class Plate extends Armor {
	constructor(
		name = 'Plate',
		type = 'heavy',
		cost = 1500,
		weight = '65lb',
		strength = 15,
		stealth = 'disadvantage',
		armorClass = 18,
		dexMod = null,
	) {
		super({
			name: name,
			type: type,
			cost: cost,
			weight: weight,
			strength: strength,
			stealth: stealth,
			armorClass: armorClass,
			dexMod: dexMod,
		});
	}
}

export class Shield extends Armor {
	constructor(
		name = 'Shield',
		type = 'shield',
		cost = 10,
		weight = '6lb',
		strength = null,
		stealth = null,
		armorClass = 2,
		dexMod = null,
	) {
		super({
			name: name,
			type: type,
			cost: cost,
			weight: weight,
			strength: strength,
			stealth: stealth,
			armorClass: armorClass,
			dexMod: dexMod,
		});
	}
}
