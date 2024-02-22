'use client';

/**
 * This function is going to return a random integer number
 *
 * getRandInclusive takes in two arguments:
 * Max is the highest number the function should consider returning
 * Min is the lowest number the function should consider returning
 *
 * This is going to be used (for now) to simulate dice rolls
 *
 */
export const getRandInclusive = (max, min = 1) => {
	return Math.floor(Math.random() * (max - min) + min);
};

/**
 * This function simulate the rolling for multiple dice
 *
 * rollDice takes in two arguments:
 * numDice represents the number of dice rolls to simulate
 * sides indicates how many sides the dice should have
 *
 * If we wanted to roll a 20 sided dice 4 times we would call rollDice(4, 20)
 *
 * We return an array of numbers representing each roll
 *
 */
export const rollDice = (numDice, sides) => {
	let rolls = [];
	for (let i = 0; i < numDice; i++) {
		rolls.push(getRandInclusive(sides));
	}

	// console.log(`rollDice: `, rolls);

	return rolls;
};

/**
 * This function operates similarly to rollDice,
 * but instead of returning an array of individual dice rolls,
 * it returns the sum of all the dice rolls.
 *
 * sumDiceRolls takes in two arguments:
 * numDice represents the number of dice rolls to simulate
 * sides indicates how many sides the dice should have
 *
 * We return an integer representing the sum of each dice roll
 */
export const sumDiceRolls = (numDice, sides) => {
	const rolls = rollDice(numDice, sides);

	// console.log(`sumDiceRolls: `, rolls);

	const total = rolls.reduce((accumulator, currentValue) => {
		return accumulator + currentValue;
	}, 0);

	// console.log(`sumDiceTotal: `, total);

	// Add the value of each roll to the total and return the sum
	return parseInt(total);
};

/**
 * This function is going to simulate multiple dice rolls, drop the lowest scoring dice,
 * and return the sum of the remaining dice.
 *
 * dropLow takes in two arguments:
 * numDice represents the number of dice rolls to simulate
 * sides represents how many sides the dice should have
 *
 * We return the sum of dice rolls after dropping the lowest roll value.
 *
 */
export const dropLow = (numDice, sides) => {
	let rolls = [];
	rolls = rollDice(numDice, sides);

	let lowest;

	// Add the value of each roll to the total
	let total = rolls.reduce((accumulator, currentValue) => {
		return accumulator + currentValue;
	}, 0);

	// console.log(`dropLowTotal: `, total);

	// Determine the lowest value in the rolls array.
	// Cycle through the rolls array. If the currentValue is less than accumulator then return the currentValue, otherwise return the accumulator.
	lowest = rolls.reduce((accumulator, currentValue) => {
		return accumulator < currentValue ? accumulator : currentValue;
	}, rolls[0]);

	// console.log(`dropLowLowest: `, lowest);

	// Subtract the lowest value from the total.
	total -= lowest;

	// console.log(`dropLowFinalTotal: `, total);

	return total;
};

/**
 * This function operates like dropLow(), but ensures a minimum return value
 *
 * dropLow takes in three arguments:
 * numDice represents the number of dice rolls to simulate
 * sides represents how many sides the dice should have
 * floor is the lowest possible number the function should return (default 0)
 * If the sum of all remaining dice (after dropping the lowest) is less than the floor,
 * then we re-do the roll.
 *
 * We return the sum of dice rolls after dropping the lowest roll value.
 */
export const dropLowFloor = (numDice, sides, floor = 0) => {
	let total = 0;

	do {
		total = dropLow(numDice, sides);
	} while (total < floor);

	return total;
};

/**
 * minNum is a helper function that we'll use to ensure we're always using a valid integer
 *
 * There are instances where we need to ensure a number is greater than X. Most times,
 * X will be 0.
 * Example:
 * An attackDamage roll comes out as 1, but the strength modifier is -2. When combined,
 * the actual damage dealt would be -1. In this case we'd want to say that the attack missed
 * or caused no damage. We would NOT want to add a HP to the target user. So we would pass
 * the actual damage amount through minNum to ensure the lowest number used is 0.
 *
 * minNum takes in two arguments:
 * number is the value we want to check
 * floor is the lowest value we should return - if number is less than floor,
 * we return floor.
 */
export const minNum = (number, floor = 0) => {
	return number < floor ? floor : number;
};

/**
 * maxNum is a helper function that we'll use to ensure we're always using a valid integer
 *
 * There are instances where we need to ensure a number is less than X.
 * Example:
 * An character has minor taken minor damage (5hp) so they've performed a heal action.
 * The heal action roll is a 7, plus a base of 2 is 9. Which is greater than the character's
 * maxHP. In this case we'd want to max out the character's HP,
 * but not go higher than that.So we would pass the character's maxHP through
 * maxNum to ensure the hughest number used is their maxHP value.
 *
 * maxNum takes in two arguments:
 * number is the value we want to check
 * ceil is the highest value we should return - if number is greater than ceil,
 * we return ceil.
 */
export const maxNum = (number, ceil = 0) => {
	return number > ceil ? ceil : number;
};

/**
 * clone is a helper function used by the reducers dispatch function.
 *
 * useReducer is used to create a game state.
 * the clone function creates a copy of the current state of the game.
 *
 * From there, we can modify the the clone and return the clone at the end
 * of the reducer function.
 */
export const clone = (x) => JSON.parse(JSON.stringify(x));
