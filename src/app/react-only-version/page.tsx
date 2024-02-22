'use client';
import React, { useReducer, useRef, useState } from 'react';

import * as util from './util';
import * as chars from './characters';
import Character from './character';

function App() {
	return (
		<div>
			<Game />
		</div>
	);
}

/**
 * setupInitialGameState is a function that will run as the gameState is initialized.
 *
 * We need a function to run as we build the initial gameState.
 * useReducer's second argument takes in the initial state gameState. We're setting
 * that manually for now.
 * A third argument can be passed to useReducer to denote a function to run on
 * initialization. setupInitialGameState is that function.
 *
 * This function will accept the initial state as an argument.
 */

const setupInitialGameState = (initialGameState: any) => {
	// console.log(`initialGameState: `, initialGameState);

	// Get the characters array out of the initialGameState, roll for initiative,
	// add dexterityMod and assign to the characters initiative value.
	// Then sort the characters array based on those initiative values.
	const characterWithInitiativeSorted = initialGameState.characters
		.map((character: any) => {
			const initiativeRoll = Number(util.rollDice(1, 20));
			const initiativeWithDexMod = initiativeRoll + character.dexterityMod;
			return {
				...character,
				initiative: initiativeWithDexMod,
			};
		})
		.sort((a: any, b: any) => b.initiative - a.initiative);

	// console.log(`characterWithInitiativeSorted: `, characterWithInitiativeSorted);

	// Rebuild the initialGameState with new characters array
	const newInitialGameState = {
		...initialGameState,
		characters: characterWithInitiativeSorted,
	};

	// console.log(`newInitialGameState: `, newInitialGameState);

	// The clone function is converting all of our character/weapon/armor class objects
	// into simple objects, which results in losing all of our character/weapon/armor
	// methods.
	//
	// We have to convert them back by taking each character object and re-constructing
	// it as a Character.
	//
	// This has been fully fixed for Character objects,
	// but not for Weapon and Armor objects.
	// TODO: Fix for Weapon and Armor objects
	newInitialGameState.characters = newInitialGameState.characters.map(
		(character: any) => new Character(character.id, character.name, { ...character }),
	);

	return newInitialGameState;
};

/**
 * The gameStateReducer function is going to be used to update the game state.
 *
 * It takes in two arguments:
 * state is the current state of the component
 * action is an object that describes what state change should occur.
 *
 * gameStateReducer returns the new state, it does NOT mutate the current state.
 * It needs to return a new game state object.
 */
const gameStateReducer = (state: any, action: any) => {
	// Clone the current game state so we can modify it and return the modified version.
	const nextState = util.clone(state);
	console.log(`nextState: `, nextState);

	// The clone function is converting all of our character/weapon/armor class objects
	// into simple objects, which results in losing all of our character/weapon/armor
	// methods.
	//
	// We have to convert them back by taking each character object and re-constructing
	// it as a Character.
	//
	// This has been fully fixed for Character objects,
	// but not for Weapon and Armor objects.
	// TODO: Fix for Weapon and Armor objects
	nextState.characters = nextState.characters.map(
		(character: any) => new Character(character.id, character.name, { ...character }),
	);

	console.log(`nextState: `, nextState);

	/**
	 * The updateActionLog function is just updating the actionLog state.
	 *
	 * It takes in one argument: the new message to add to the actionLog.
	 *
	 * Then it overwrites the old actionLog, passing in the new message
	 * before then adding all the old messages.
	 */
	const updateActionLog = (newActionLogMessage: any) => {
		nextState.actionLog = [`${newActionLogMessage}`, ...nextState.actionLog];
	};

	/**
	 * The checkForWin function checks the characters object in the gameState
	 * to determine if all the characters associated with a playerId have the
	 * 'unconscious' status.
	 *
	 * When a character's HP falls to zero we add a status of 'unconscious'.
	 * checkForWin will get a list of unique playerIds from the character
	 * object of the gameState. From there we cycle through all the characters,
	 * grouping together characters managed by the same playerId, and getting
	 * their statuses (checking for 'unconscious').
	 */
	const checkForWin = () => {
		// TODO: Give this a rethink. It seems to be working, but is this the
		// most efficient way to accomplish this?
		//
		// This will get us an array of all gameState.characters.playerIds (not unique)
		const playerIds = nextState.characters.map((character: any) => character.playerId);
		// This gets us an array of unique character.playerIds
		const uniquePlayerIds = playerIds.filter(util.onlyUnique);
		// const uniquePlayerIds = [...new Set(playerIds)];
		// console.log(`uniquePlayerIds: `, uniquePlayerIds);

		// This should give us an array of boolean values that indicates if
		// every character associated with a playerId is unconscious or not
		const everyCharacterPerPlayerIdUnconscious = uniquePlayerIds.map((playerId: any) => {
			return nextState.characters
				.filter((character: any) => character.playerId === playerId)
				.every((character: any) => character.status.includes('unconscious'));
		});

		return everyCharacterPerPlayerIdUnconscious.some((teamUnconscious: any) => teamUnconscious);
	};

	/**
	 * The nextTurn function is going to cycle the currentPlayerIndex to the next character
	 */
	const nextTurn = (currentPlayerIndex: any) => {
		return (currentPlayerIndex + 1) % nextState.characters.length;
	};

	// If the gameState.status is set to 'completed' (the game has been won)
	// and the user isn't resetting the game then we don't want them to be able
	// to do anything, and we return the existing state of the game.
	if (state.status === 'completed' && action.type !== 'RESET') {
		return state;
	}

	if (action.type === 'CHARACTER_ACTION') {
		// Pull the act, actor and target values of the action object.
		const { act, actorID, targetID } = action;
		console.log(`act: `, act);

		const actor = nextState.characters.find((char: any) => char.id === actorID);
		const actorIndex = nextState.characters.findIndex((char: any) => char.id === actorID);
		console.log(`actorID: `, actorID);
		console.log(`actor: `, actor);
		console.log(`actorIndex: `, actorIndex);

		const target = nextState.characters.find((char: any) => char.id === parseInt(targetID));
		const targetIndex = nextState.characters.findIndex((char: any) => char.id === parseInt(targetID));
		console.log(`targetID: `, targetID);
		console.log(`target: `, target);
		console.log(`targetIndex: `, targetIndex);

		updateActionLog(`${actor.name}'s turn.`);
		/**
		 * Attack %: roll 1d20 (1 = miss, 20 = critical, anything else compares against armor class) + Strength Mod
		 * Compare against opponent armor class to determine attack success
		 * Attack Damage: 1d10 (2d10 if critical) + Strength Mod
		 * Armor Class: 12 + Dex Mod (max 2)
		 * Heal: 2d4 + 2
		 */

		// If the act is 'attack'.
		if (act === 'attack') {
			updateActionLog(`${actor.name} attacks ${target.name}.`);

			// criticalFlag is a boolean used to track whether the attack was critical or not.
			let criticalFlag = false;
			// attackMissFlag is a boolean used to track whether the attack missed or not.
			let attackMissFlag = false;
			// attackCheck is a dice roll from 1-20 that will (after adding the
			// actor.strengthMod) be compared against the target.armorClass to determine
			// whether attack was successful or not.
			const attackCheck = Number(util.rollDice(1, 20));
			// attackCheck adds the actor.strengthMod to attackCheck.
			const attackCheckWithMod = util.minNum(attackCheck + actor.strengthMod);
			// initialize the attackDamageRoll variable.
			let attackDamageRoll;

			// Output some attack information to the actionLog.
			updateActionLog(`${actor.name} rolls to determine attack success.`);
			updateActionLog(`${actor.name} rolls a ${attackCheck}.`);
			updateActionLog(`${actor.name}'s attack check with strengthMod is ${attackCheckWithMod}.`);
			updateActionLog(`${target.name}'s AC is ${target.armorClass}.`);

			// Check if the attack was critical.
			if (attackCheck === 20) {
				criticalFlag = true;
			}

			// Check if the attack missed.
			if (attackCheck === 1) {
				attackMissFlag = true;
			}

			// If the attackCheckWithMod is greater than the target's armorClass OR
			// the attackCheck is 20, then the attack was successful.
			if (attackCheckWithMod >= target.armorClass || criticalFlag) {
				// If the attack is critical, then we roll 2d instead of 1
				if (criticalFlag) {
					updateActionLog(`${actor.name}'s attack was critical!`);
					attackDamageRoll = Number(
						util.sumDiceRolls(2 * actor.weapons.damageDiceQuantity, actor.weapons.damageDiceSize),
					);
				}
				// The attack was not critical, so roll 1d.
				else {
					updateActionLog(`${actor.name}'s attack was successful.`);
					attackDamageRoll = Number(util.rollDice(actor.weapons.damageDiceQuantity, actor.weapons.damageDiceSize));
				}

				updateActionLog(`${actor.name}'s attack damage roll was ${attackDamageRoll}.`);
				// Add the actor.strengthMod to the attackDamageRoll to determine total attack damage.
				const attackDamageRollWithMod = util.minNum(attackDamageRoll + actor.strengthMod);

				updateActionLog(`${target.name} had ${target.hp} HP.`);
				updateActionLog(`${actor.name}'s attack caused ${attackDamageRollWithMod} damage.`);

				const newHp = util.minNum(target.hp - attackDamageRollWithMod);

				nextState.characters[targetIndex].hp = newHp;

				// If newHp value is zero, then the character is unconscious
				// so we add the unconscious status, and output a message
				if (newHp === 0) {
					nextState.characters[targetIndex].status = ['unconscious'];
					updateActionLog(`${target.name} is unsconscious.`);
				}
				// If the newHp !== 0 then just output the new HP value to the actionLog.
				else {
					updateActionLog(`${target.name} now has ${newHp} HP.`);
				}
			}
			// If the attackCheckWithMod is < target's armorClass or the attackCheck was 1,
			// then the attack was not successful.
			else if (attackCheckWithMod < target.armorClass || attackMissFlag) {
				updateActionLog(`${actor.name}'s attack misses.`);
			}
		}
		// If the act is 'heal'.
		else if (act === 'heal') {
			updateActionLog(`${actor.name} uses potion of healing.`);

			// Roll 2d4 to determine initial heal amount
			const healRoll = Number(util.sumDiceRolls(2, 4));
			// Potion of healing is 2d4 + 2 so here we're adding the extra 2.
			const healAmount = healRoll + 2;

			updateActionLog(`${actor.name}'s potion roll heals ${healAmount} HP.`);
			updateActionLog(`${target.name} had ${target.hp} HP.`);

			const newHp = util.maxNum(target.hp + healAmount, target.maxHp);

			nextState.characters[targetIndex].hp = newHp;
			updateActionLog(`${target.name} now has ${newHp} HP.`);
		}

		if (checkForWin()) {
			nextState.status = 'completed';
			updateActionLog(`Game Over`);
			return nextState;
		}

		nextState.currentPlayerIndex = nextTurn(nextState.currentPlayerIndex);

		updateActionLog(`**********`);
	}
	if (action.type === 'NEXT_TURN') {
		nextState.currentPlayerIndex = nextTurn(nextState.currentPlayerIndex);
	}
	if (action.type === 'START_GAME') {
		nextState.status = 'inProgress';
	}

	return nextState;
};

function Game() {
	// Initialize the gameState using useReducer hook.
	//
	// First argument is the name of the function to call when we dispatchGameState.
	// Second argument is the initial value for the characters state.
	// Third argument is a function to run on initialization.
	//
	// gameState will include the actionLog, an array of characters,
	// the game status, the currentPlayerIndex, and more.
	const [gameState, dispatchGameState] = useReducer(
		gameStateReducer,
		{
			actionLog: '',
			status: 'preGame',
			currentPlayerIndex: 0,
			characters: [
				chars.rowan,
				chars.larry,
				// chars.ben,
				// chars.nick,
				// chars.michelle,
				chars.nightcrawler,
				chars.wolverine,
				// chars.x23,
				chars.sabretooth,
				chars.juggernaut,
				// chars.bishop,
				chars.magneto,
			],
		},
		setupInitialGameState,
	);

	const { actionLog, characters, status: gameStatus, currentPlayerIndex } = gameState;

	/**
	 * actionHandler processes character acts during their turn.
	 *
	 * the actionHandler function takes in three parameters:
	 * act is a string that indicates what aciton has been taken ('attack', 'heal').
	 * actor is the ID of the Character taking action this turn.
	 * target is the ID of the Character on the receiving end of the action.
	 */
	const actionHandler = async (act: any, actorID: any, targetID: any) => {
		console.log(`act: `, act);
		console.log(`actorID: `, actorID);
		console.log(`targetID: `, targetID);
		await dispatchGameState({ type: 'CHARACTER_ACTION', act: act, actorID: actorID, targetID: targetID });
	};

	const startGameButtonHandler = async () => {
		await dispatchGameState({ type: 'START_GAME' });
	};

	let turnComponent: any = '';
	if (gameStatus === 'preGame') {
		turnComponent = (
			<button
				className='btn btn-primary'
				onClick={startGameButtonHandler}
			>
				Start Game!
			</button>
		);
	}

	// If the gameStatus is still 'inProgress' && the current player is not unconscious
	if (gameStatus === 'inProgress' && !characters[currentPlayerIndex].status.includes('unconscious')) {
		// If the current playerId === 1 then display the TurnComponent
		if (gameStatus === 'inProgress' && characters[currentPlayerIndex].playerId === 1) {
			turnComponent = (
				<TurnComponent
					currentPlayerIndex={currentPlayerIndex}
					characters={characters}
					onAction={actionHandler}
				/>
			);
		}
		// If the currentplayerId === 0 then run the attack action targeting character.id === 1
		else if (gameStatus === 'inProgress' && characters[currentPlayerIndex].playerId === 0) {
			actionHandler('attack', characters[currentPlayerIndex].id, 1);
		}
	}
	// If the gameStatus is still 'inProgress' but the character is unconscious
	// dispatchGameState to action.type === 'NEXT_TURN'
	else if (gameStatus === 'inProgress' && characters[currentPlayerIndex].status.includes('unconscious')) {
		dispatchGameState({ type: 'NEXT_TURN' });
	}

	return (
		<div className='container-fluid'>
			<div className='row justify-content-between align-content-stretch'>
				<div className='col-4 bg-light'>
					<div className='row'>
						{characters
							.filter((character: any) => character.playerId === 1)
							.sort((a: any, b: any) => a.id - b.id)
							.map((character: any) => {
								console.log(`character: `, character);
								return (
									<CharacterBattleData
										key={character.id}
										character={character}
									/>
								);
							})}
					</div>
				</div>

				<div className='col-3'>
					<div
						className='border-bottom border-dark'
						style={{ height: '25cqh' }}
					>
						{gameStatus === 'inProgress' || gameStatus === 'preGame' ? turnComponent : ''}
					</div>

					<div style={{ height: '75cqh', overflow: 'scroll' }}>
						{actionLog && actionLog.length > 0 ? (
							actionLog.map((entry: any, index: any) => (
								<p
									className='small'
									style={{ marginBottom: '4px' }}
									key={index}
								>
									{entry}
								</p>
							))
						) : (
							<p>No actions logged yet.</p>
						)}
					</div>
				</div>

				<div className='col-4 bg-dark text-light'>
					<div className='row'>
						{characters
							.filter((character: any) => character.playerId === 0)
							.sort((a: any, b: any) => a.id - b.id)
							.map((character: any) => {
								console.log(`character: `, character);
								return (
									<CharacterBattleData
										key={character.id}
										character={character}
									/>
								);
							})}
					</div>
				</div>
			</div>
		</div>
	);
}

const TurnComponent = (props: any) => {
	const { characters, currentPlayerIndex } = props;
	const currentPlayer = characters[currentPlayerIndex];
	const currentPlayersTeam = characters.filter((character: any) => currentPlayer.playerId === character.playerId);
	const oppositionTeam = characters.filter((character: any) => currentPlayer.playerId !== character.playerId);
	// const charactersAlive = characters.filter( character => !character.status.includes('dead') );
	const selectedAct: any = useRef('DEFAULT');
	const selectedTargetId: any = useRef('DEFAULT');
	const [targetOptions, setTargetOptions] = useState(
		characters.map((char: any) => (
			<option
				key={char.id}
				value={char.id}
			>
				{char.name}
			</option>
		)),
	);

	// console.log(`currentPlayer: `, currentPlayer);
	// console.log(`currentPlayersTeam: `, currentPlayersTeam);
	// console.log(`oppositionTeam: `, oppositionTeam);
	// console.log(`selectedAct.current.value: `, selectedAct.current.value);
	// console.log(`selectedTargetId.current.value: `, selectedTargetId.current.value);

	// console.log(`${currentPlayer.name}'s turn.`);

	const actChangeHandler = () => {
		if (selectedAct.current.value === 'attack') {
			setTargetOptions(
				oppositionTeam.map((char: any) => (
					<option
						key={char.id}
						value={char.id}
					>
						{char.name}
					</option>
				)),
			);
		} else if (selectedAct.current.value === 'heal') {
			setTargetOptions(
				currentPlayersTeam.map((char: any) => (
					<option
						key={char.id}
						value={char.id}
					>
						{char.name}
					</option>
				)),
			);
		}
		// console.log(`targetOptions: `, targetOptions);
	};

	const actionButtonHandler = (event: any) => {
		event.preventDefault();

		// console.log(`selectedAct.current.value: `, selectedAct.current.value);
		// console.log(`currentPlayer.id: `, currentPlayer.id);
		// console.log(`selectedTargetId.current.value: `, selectedTargetId.current.value);

		props.onAction(selectedAct.current.value, currentPlayer.id, selectedTargetId.current.value);
		selectedTargetId.current.value = 'DEFAULT';
		selectedAct.current.value = 'DEFAULT';
	};

	return (
		<div>
			<div className='mb-3'>
				<label>Select Actions</label>
				<select
					id='act'
					className='form-control text-capitalize'
					defaultValue={'DEFAULT'}
					ref={selectedAct}
					onChange={actChangeHandler}
				>
					<option
						disabled
						value='DEFAULT'
					></option>
					<option value='attack'>Attack</option>
					<option value='heal'>Heal</option>
				</select>
			</div>

			<div className='mb-3'>
				<label>Select Target</label>
				<select
					id='target'
					className='form-control text-capitalize'
					defaultValue={'DEFAULT'}
					ref={selectedTargetId}
				>
					<option
						disabled
						value='DEFAULT'
					></option>
					{targetOptions}
				</select>
			</div>
			<button
				className='btn btn-primary'
				onClick={actionButtonHandler}
			>
				Go!
			</button>
		</div>
	);
};

const CharacterBattleData = (props: any) => {
	// Pull character data out of props into it's own variable.
	const character = props.character;

	return (
		<div
			id={character.id}
			key={character.id}
			className='col-12 col-md-6'
		>
			<h2>{character.name}</h2>
			<p className='small text-capitalize'>{`${character.subRace || character.race}, level: ${character.level}`}</p>
			<p>
				<strong>HP: </strong> {`${character.hp} / ${character.maxHp}`}
				<br />
				<strong>Str: </strong> {`${character.strength} / ${character.strengthMod}`}
				<br />
				<strong>Dext: </strong> {`${character.dexterity} / ${character.dexterityMod}`}
				<br />
				<strong>Const: </strong> {`${character.constitution} / ${character.constitutionMod}`}
				<br />
				<strong>Int: </strong>
				{`${character.intelligence} / ${character.intelligenceMod}`}
				<br />
				<strong>Wis: </strong>
				{`${character.wisdom} / ${character.wisdomMod}`}
				<br />
				<strong>Charm: </strong>
				{`${character.charisma} / ${character.charismaMod}`}
				<br />
				<strong>Weapons: </strong> {`${character.weapons.name}`}
				<br />
				<strong>Armor: </strong> {`${character.armorNames}`}
				<br />
				<strong>Armor Class: </strong> {`${character.armorClass}`}
				<br />
				<strong>Initiative: </strong> {`${character.initiative}`}
				<br />
				<strong>Statuses: </strong> {`${character.status}`}
			</p>
		</div>
	);
};

export default App;
