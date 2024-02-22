'use client';
export class Weapon {
	constructor({
		name,
		type,
		cost,
		costUnit = 'gp',
		weight,
		properties,
		damageDiceQuantity,
		damageDiceSize,
		damageType,
	}) {
		this.name = name;
		this.type = type;
		this.cost = cost;
		this.costUnit = costUnit;
		this.weight = weight;
		this.properties = properties;
		this.damageDiceQuantity = damageDiceQuantity;
		this.damageDiceSize = damageDiceSize;
		this.damageType = damageType;
	}

	toJSON() {
		return {
			objectClassName: this.name,
			...this,
		};
	}
}

export class Shortsword extends Weapon {
	constructor(
		name = 'Shortsword',
		type = ['martial', 'melee'],
		cost = 10,
		weight = '2lb',
		properties = ['finesse', 'light'],
		damageDiceQuantity = 1,
		damageDiceSize = 6,
		damageType = 'piercing',
	) {
		super({ name, type, cost, weight, properties, damageDiceQuantity, damageDiceSize, damageType });
	}
}

export class Scimitar extends Weapon {
	constructor(
		name = 'Scimitar',
		type = ['martial', 'melee'],
		cost = 25,
		weight = '3lb',
		properties = ['finesse', 'light'],
		damageDiceQuantity = 1,
		damageDiceSize = 6,
		damageType = 'slashing',
	) {
		super({ name, type, cost, weight, properties, damageDiceQuantity, damageDiceSize, damageType });
	}
}

export class Greatsword extends Weapon {
	constructor(
		name = 'Greatsword',
		type = ['martial', 'melee'],
		cost = 50,
		weight = '6lb',
		properties = ['heavy', 'two-handed'],
		damageDiceQuantity = 2,
		damageDiceSize = 6,
		damageType = 'slashing',
	) {
		super({ name, type, cost, weight, properties, damageDiceQuantity, damageDiceSize, damageType });
	}
}
