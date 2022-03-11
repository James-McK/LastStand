const imgOutside = "assets/images/cabin-outside.webp";
const imgInside = "assets/images/cabin-inside.webp";
const imgHatch = "assets/images/cabin-trapdoor.jpg";

const audioWind = "assets/sounds/wind.wav";
const audioRain = "assets/sounds/rain_2.wav";

const profHunter = "Hunter";
const profMechanic = "Mechanic";
const profDoctor = "Doctor";
const profVeteran = "Veteran";
const profPriest = "Priest";

// TODO: Add ways to survive/die
// TODO: Only event OR choice should be able to update game state (Or should most of the time, anyway). Which?
const eventOpts = [
	{
		id: "outside",
		choices: [
			{
				desc: "Enter the cabin",
				requiredState: { hasBeenInsideCabin: false },
				stateChanges: { hasBeenInsideCabin: true },
				nextEventId: "initialInsideCabin",
				disableMode: "hidden",
			},
			{
				desc: "Enter the cabin",
				requiredState: { hasBeenInsideCabin: true },
				nextEventId: "insideCabin",
				disableMode: "hidden",
			},
			{
				desc: "Search for firewood",
				requiredState: { hasVisitedFirewood: false },
				stateChanges: { hasVisitedFirewood: true },
				nextEventId: "searchForFirewood",
				disableMode: "hidden",
			},
			{
				desc: "Return the the pile of firewood",
				requiredState: { hasVisitedFirewood: true },
				nextEventId: "visitFirewood",
				disableMode: "hidden",
			},
			{
				desc: "Venture deeper into the forest",
				nextEventId: undefined,
			},
		],
	},

	// BEGIN: Firewood
	{
		id: "atFirewood",
		choices: [
			{
				desc: "Ignore the firewood for now and return to the entrance to the cabin",
				nextEventId: "leaveLogs",
			},
			{
				desc: "Take some of the logs",
				requiredState: { hasLargeFirewood: false },
				stateChanges: { hasLargeFirewood: true },
				nextEventId: "takeLargeFirewood",
				disableMode: "hidden",
			},
			{
				desc: "Make some smaller kindling out of the logs using your saw",
				requiredState: { hasSaw: true /* That variable may need renamed */, hasKindling: false },
				// TODO: Inventory?
				stateChanges: { hasKindling: true },
				nextEventId: "makeKindling",
			},
			{
				desc: "Venture out into the woods and see what you can find",
				nextEventId: undefined,
			},
		],
	},
	{
		id: "takingLargeFirewood",
		choices: [
			{
				desc: "Return to the entrance to the cabin with your blocks of firewood",
				nextEventId: "leaveLogs",
			},
		],
	},
	{
		id: "makingKindling",
		choices: [
			{
				desc: "Return to the entrance to the cabin with your kindling",
				nextEventId: "leaveLogs",
			},
			{
				desc: "Return the the entrance to the cabin and take some larger blocks of firewood too",
				nextEventId: "leaveLogs",
				requiredState: { hasLargeFirewood: false },
				stateChanges: { hasLargeFirewood: true },
			},
		],
	},
	// END: Firewood

	// BEGIN: Inside
	{
		id: "inside",
		choices: [
			{
				desc: "Leave the cabin",
				nextEventId: "leaveCabin",
			},
			{
				desc: "Begin searching the cabin",
				nextEventId: "searchingCabin",
				requiredState: { rifledCabin: false },
				stateChanges: { rifledCabin: true },
				disableMode: "hidden",
			},
			{
				desc: "Continue searching the cabin",
				nextEventId: "continueSearchingCabin",
				requiredState: { rifledCabin: true, searchedCabin: false },
				stateChanges: { searchedCabin: true },
				disableMode: "hidden",
			},
			{
				desc: "Thoroughly search the rest of the cabin",
				nextEventId: "thoroughlySearchCabin",
				requiredState: { searchedCabin: true, thoroughlySearchedCabin: false },
				stateChanges: { thoroughlySearchedCabin: true },
				disableMode: "hidden",
			},
			{
				desc: "Take the stack of planks you found earlier",
				nextEventId: "",
				requiredState: { foundPlanks: true, hasPlanks: false },
				stateChanges: { hasPlanks: true },
				disableMode: "hidden",
			},
			{
				desc: "See if any of the furniture can be moved to create a barricade",
				nextEventId: "testBarricadingFurniture",
			},
			{
				desc: "Take a closer look at the hatch in the floor",
				nextEventId: "approachHatch",
			},
		],
	},
	{
		id: "riflingCabin",
		choices: [
			{
				desc: "Continue searching",
				nextEventId: "continueSearchingCabin",
				stateChanges: { searchedCabin: true },
			},
			{
				desc: "Abandon your search for now",
				nextEventId: "insideCabin",
			},
		],
	},
	{
		id: "continuedSearchingCabin",
		choices: [
			{
				desc: "Take the planks and search the cabin for a hammer and nails",
				nextEventId: "thoroughlySearchCabin",
				requiredState: { hasHammer: false, hasNails: false },
				stateChanges: { hasPlanks: true },
				disableMode: "hidden",
			},
			{
				desc: "Take the planks and search the cabin for some nails",
				nextEventId: "thoroughlySearchCabin",
				requiredState: { hasHammer: true, hasNails: false },
				stateChanges: { hasPlanks: true },
				disableMode: "hidden",
			},
			{
				desc: "Take the planks and search the cabin for a hammer",
				nextEventId: "thoroughlySearchCabin",
				requiredState: { hasHammer: false, hasNails: true },
				stateChanges: { hasPlanks: true },
				disableMode: "hidden",
			},
			{
				desc: "Lucky you've already got both! Take the planks and keep searching for anything else that looks useful",
				nextEventId: "thoroughlySearchCabin",
				requiredState: { hasHammer: true, hasNails: true },
				stateChanges: { hasPlanks: true },
				disableMode: "hidden",
			},
			{
				desc: "Ignore the planks for now and continue searching the cabin for anything else useful",
				nextEventId: "thoroughlySearchCabin",
				stateChanges: { foundPlanks: true },
			},
			{
				desc: "Ignore the planks for now and stop searching - you doubt you'll find anything else useful in this place",
				nextEventId: "insideCabin",
				stateChanges: { foundPlanks: true },
			},
		],
	},
	{
		id: "inspectingHatch",
		choices: [
			{
				desc: "Ignore the hatch for now",
				nextEventId: "insideCabin",
			},
			{
				desc: "Use your spare key to open the lock",
				nextEventId: "unlockHatch",
				requiredState: { profession: profHunter },
				stateChanges: { hatchOpen: true },
				disableMode: "hidden",
			},
			{
				desc: "Pick the lock",
				nextEventId: "pickHatchLock",
				requiredState: { canLockpick: true /* A bunch of these probably need renamed depending on what other people do */ },
				stateChanges: { hatchOpen: true },
			},
			{
				desc: "Cut the lock's shackle using your bolt cutters",
				nextEventId: "cutHatchLockBolts",
				requiredState: { hasBoltCutters: true },
				stateChanges: { hatchOpen: true },
			},
			{
				desc: "Use your crowbar to pry open the hatch",
				nextEventId: "pryOpenHatch",
				requiredState: { hasCrowbar: true },
				stateChanges: { hatchOpen: true },
			},
		],
	},
	{
		id: "openedHatch",
		choices: [
			{
				desc: "Climb down the ladder into the darkness below",
				nextEventId: undefined,
			},
			{
				desc: "Ignore the basement for now",
				nextEventId: "insideCabin",
			},
		],
	},
	// END: Inside
];

const events = [
	{
		id: "firstVisitOutside",
		text: `Following the path deeper into the dark woods, you stumble across a lone cabin.
        It looks to have been recently abandoned, and you can see signs of zombies nearby.
        The windows have been smashed in and the door is hanging off its hinges.
        You might be able to find some wood for a fire here, or with some barricades you might even be able to spend the night here.`,
		img: imgOutside,
		audio: audioWind,
		optsId: "outside",
	},
	{
		id: "leaveCabin",
		text: `Leaving the shelter of the cabin, you feel the strength of the harsh wind once again. The sky is already beginning to darken - not much longer until night falls.`,
		img: imgOutside,
		audio: audioWind,
		optsId: "outside",
	},
	{
		id: "leaveLogs",
		text: `Leaving the little shelter the side of the cabin provides, you feel the crisp wind hit you again. It seems like it will be a cold night.`,
		img: imgOutside,
		audio: audioWind,
		optsId: "outside",
	},

	// BEGIN: Firewood
	{
		id: "searchForFirewood",
		text: `Walking around the house, you find a large stack of logs. Unfortunately, they're too big to help you start the fire,
        but they'll be useful for keeping it going throughout the night.<br />
        If you had a <strong>saw</strong> of some sort, you could cut some of them up into kindling.<br />
        You might also be able to find some smaller branches out in the forest, but who knows what's out in those dark woods?<br />
        Or you could hope that you find some other kindling before night.`,
		optsId: "atFirewood",
	},
	{
		id: "visitFirewood",
		text: "You return to the stack of logs.",
		optsId: "atFirewood",
	},
	{
		id: "takeLargeFirewood",
		text: `You take some of the wood with you. It's heavy, but you should have enough now to last you the night.<br />
        If you find a saw, you can always return here and make some kindling.`,
		// IDEA: Making kindling when you find the saw from the wood you already have is probably too ambitious, right?
		optsId: "takingLargeFirewood",
	},
	{
		id: "makeKindling",
		text: `You saw some of the logs into smaller peices of kindling. This should be a great help in starting a fire to keep you warm enough to last through tonight.<br />
        Do you want to take some larger blocks of wood too?`,
		optsId: "makingKindling",
	},
	// END: Firewood

	// BEGIN: Inside cabin
	{
		id: "initialInsideCabin",
		text: `Pushing the broken door aside, you enter the cabin. As your eyes adjust to its dark interior, you get a better picture of the state of disrepair the cabin is now in.
        Broken glass from the shattered windows litters the floor, and the room is a mess.<br />
        You also spot a hatch in the floor.`,
		img: imgInside,
		audio: audioRain,
		optsId: "inside",
	},
	{
		id: "insideCabin",
		text: `Returning to the cabin`,
		img: imgInside,
		audio: audioRain,
		optsId: "inside",
	},
	{
		id: "searchingCabin",
		text: `You begin rifling through the cupboards and cabinets in the cabin. They seem mostly empty or filled with junk,
        but you're able to scavenge a few tins of food and a bottle of water. There's also a locked safe hidden at the back of a cabinet, but no signs of a combination anywhere.`,
		// TODO: Anything inside safe, or just note for the hunter?
		// TODO: Image
		optsId: "riflingCabin",
	},
	{
		id: "continueSearchingCabin",
		text: `Continuing your search, you spot a stack of wooden planks shoved under the bed.
        Not what you'd want to build a cabin out of, but good enough to help barricade, if you can find some nails and a hammer.`,
		optsId: "continuedSearchingCabin",
	},
	{
		id: "thoroughlySearchCabin",
		text: "Thoroughly searching",
		optsId: "thoroughlySearchingCabin",
	},
	{
		id: "testBarricadingFurniture",
		text: `Barricading`,
	},

	// BEGIN: Hatch
	{
		id: "approachHatch",
		text: `There's a heavy lock on the hatch, and it refuses to budge.<br />
        With a crowbar or some other tool you may be able to wedge the hatch open, or use something else to get past the lock itself.`,
		img: imgHatch,
		optsId: "inspectingHatch",
	},
	{
		id: "unlockHatch",
		text: `It's a good thing you remembered to bring your spare key with you when you returned. The lock is slightly rusted, but still swings open when you turn the key.
        You're very glad your sturdy lock managed to prevent [TODO Haven't decided what's down there yet] from any damage. It also means your family are nowhere to be found here -
        there's no way to lock this from the inside.`,
		optsId: "openedHatch",
	},
	{
		id: "pickHatchLock",
		text: `The lock is beginning to rust, but you're able to get it open without too much effort. This lock was designed more to look impressive than actually protect anything.`,
		optsId: "openedHatch",
	},
	{
		id: "cutHatchLockBolts",
		text: `The bolt cutters slice through the lock's shackles with ease, and you can easily pull away the rest of the lock.
        This lock was designed more to look impressive than actually protect anything.`,
		optsId: "openedHatch",
	},
	{
		id: "pryOpenHatch",
		text: `Wedging one end of the crowbar beneath a gap to the side of the hatch, you push hard against the crowbar.
        To your surprise, the shackle of the lock snaps before the hatch itself does. Looks like the lock isn't as strong as it looked.`,
		optsId: "openedHatch",
	},
	// END: Hatch

	// END: Inside cabin
];

const eventsHunter = [
	{
		id: "firstVisitOutside",
		text: `Following the path you've treaded so many times before, you find yourself outside your cabin in the woods once again. 
        You can still see signs of zombies nearby, and the window of the cabin is smashed.
        TODO Something about things aren't looking good for the rest of your family`,
	},
];
const eventsMechanic = [];
const eventsDoctor = [];
const eventsVeteran = [];
const eventsPriest = [];
