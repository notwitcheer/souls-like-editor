// Pixel Art Character Parts for Dark Fantasy Creator
// All coordinates are relative to a 64x80 base grid (scaled 4x to 256x320)

const SCALE = 4;
const BASE_WIDTH = 64;
const BASE_HEIGHT = 80;

// Color palettes for the dark fantasy theme
const COLORS = {
    // Skin tones (hollow/undead variations)
    skin: {
        human: '#c4a882',
        pale: '#a8998a',
        hollow: '#7a6b5e',
        undead: '#5a5048',
        cursed: '#4a4038',
        ashen: '#605850'
    },
    // Hair colors
    hair: {
        black: '#1a1512',
        grey: '#4a4540',
        white: '#a8a098',
        brown: '#3d2d20',
        red: '#5a2a1a',
        silver: '#8a8580'
    },
    // Metal colors
    metal: {
        iron: '#5a5550',
        steel: '#707068',
        dark: '#3a3530',
        rust: '#6a4030',
        gold: '#8a7020',
        bronze: '#6a5030'
    },
    // Fabric colors
    fabric: {
        black: '#1a1815',
        brown: '#3a2a20',
        grey: '#4a4540',
        red: '#4a1a1a',
        purple: '#2a1a3a',
        green: '#1a3a2a'
    },
    // Effect colors
    effects: {
        blood: '#6a1a1a',
        ember: '#c4601a',
        curse: '#4a0060',
        glow: '#ffa040',
        decay: '#3a3020'
    }
};

// Character part definitions
const CHARACTER_PARTS = {
    // Skin/Body type options
    skins: [
        {
            id: 'human',
            name: 'Human',
            colors: { base: '#c4a882', shadow: '#a08060', highlight: '#d4c0a0' }
        },
        {
            id: 'pale',
            name: 'Pale',
            colors: { base: '#a8998a', shadow: '#887868', highlight: '#c8b8a8' }
        },
        {
            id: 'hollow',
            name: 'Hollow',
            colors: { base: '#7a6b5e', shadow: '#5a4b3e', highlight: '#9a8b7e' }
        },
        {
            id: 'undead',
            name: 'Undead',
            colors: { base: '#5a5048', shadow: '#3a3028', highlight: '#7a7068' }
        },
        {
            id: 'cursed',
            name: 'Cursed',
            colors: { base: '#4a4038', shadow: '#2a2018', highlight: '#6a6058' }
        },
        {
            id: 'ashen',
            name: 'Ashen',
            colors: { base: '#605850', shadow: '#403830', highlight: '#807870' }
        }
    ],

    // Head/Face options
    heads: [
        { id: 'normal', name: 'Normal' },
        { id: 'gaunt', name: 'Gaunt' },
        { id: 'skull', name: 'Skull-like' },
        { id: 'noble', name: 'Noble' },
        { id: 'scarred', name: 'Scarred' },
        { id: 'hollow_eyes', name: 'Hollow Eyes' }
    ],

    // Hair styles
    hairs: [
        { id: 'none', name: 'None' },
        { id: 'short', name: 'Short', color: '#1a1512' },
        { id: 'long', name: 'Long', color: '#1a1512' },
        { id: 'messy', name: 'Messy', color: '#3d2d20' },
        { id: 'slicked', name: 'Slicked', color: '#1a1512' },
        { id: 'wild', name: 'Wild', color: '#4a4540' },
        { id: 'white', name: 'Aged', color: '#a8a098' }
    ],

    // Helmet options
    helmets: [
        { id: 'none', name: 'None' },
        { id: 'knight', name: 'Knight Helm' },
        { id: 'bucket', name: 'Bucket Helm' },
        { id: 'crown', name: 'Broken Crown' },
        { id: 'hood', name: 'Leather Hood' },
        { id: 'armet', name: 'Armet' },
        { id: 'barbute', name: 'Barbute' },
        { id: 'skull_mask', name: 'Skull Mask' }
    ],

    // Armor options
    armors: [
        { id: 'rags', name: 'Rags' },
        { id: 'leather', name: 'Leather' },
        { id: 'chainmail', name: 'Chainmail' },
        { id: 'plate', name: 'Plate' },
        { id: 'knight', name: 'Knight' },
        { id: 'wanderer', name: 'Wanderer' },
        { id: 'elite', name: 'Elite Knight' },
        { id: 'black_iron', name: 'Black Iron' }
    ],

    // Cloak options
    cloaks: [
        { id: 'none', name: 'None' },
        { id: 'tattered', name: 'Tattered' },
        { id: 'short', name: 'Short Cape' },
        { id: 'long', name: 'Long Cloak' },
        { id: 'hood_cloak', name: 'Hooded Cloak' },
        { id: 'royal', name: 'Royal Cape' }
    ],

    // Boot options
    boots: [
        { id: 'bare', name: 'Barefoot' },
        { id: 'wraps', name: 'Wraps' },
        { id: 'leather', name: 'Leather' },
        { id: 'iron', name: 'Iron' },
        { id: 'knight', name: 'Knight' },
        { id: 'plated', name: 'Plated' }
    ],

    // Weapon options
    weapons: [
        { id: 'none', name: 'None' },
        { id: 'sword', name: 'Longsword' },
        { id: 'greatsword', name: 'Greatsword' },
        { id: 'axe', name: 'Battle Axe' },
        { id: 'spear', name: 'Spear' },
        { id: 'katana', name: 'Katana' },
        { id: 'mace', name: 'Mace' },
        { id: 'scythe', name: 'Scythe' },
        { id: 'staff', name: 'Staff' }
    ],

    // Shield options
    shields: [
        { id: 'none', name: 'None' },
        { id: 'buckler', name: 'Buckler' },
        { id: 'kite', name: 'Kite Shield' },
        { id: 'tower', name: 'Tower Shield' },
        { id: 'crest', name: 'Crest Shield' },
        { id: 'skull', name: 'Skull Shield' }
    ],

    // Scar/Effect options
    scars: [
        { id: 'none', name: 'None' },
        { id: 'face_scar', name: 'Face Scar' },
        { id: 'burn', name: 'Burns' },
        { id: 'decay', name: 'Decay' },
        { id: 'curse_mark', name: 'Curse Mark' },
        { id: 'ember', name: 'Ember Glow' },
        { id: 'bleeding', name: 'Bleeding' }
    ],

    // Background options
    backgrounds: [
        { id: 'void', name: 'Void' },
        { id: 'bonfire', name: 'Bonfire' },
        { id: 'ruins', name: 'Ruins' },
        { id: 'castle', name: 'Castle' },
        { id: 'fog', name: 'Fog Gate' },
        { id: 'abyss', name: 'Abyss' },
        { id: 'shrine', name: 'Shrine' }
    ]
};

// Pixel art drawing data for each part
// These define the actual pixel positions for drawing

const PIXEL_DATA = {
    // Base body shape (used with skin color)
    body: {
        // Head position (centered)
        head: { x: 24, y: 8, width: 16, height: 16 },
        // Neck
        neck: { x: 28, y: 24, width: 8, height: 4 },
        // Torso
        torso: { x: 22, y: 28, width: 20, height: 20 },
        // Arms
        leftArm: { x: 16, y: 30, width: 6, height: 16 },
        rightArm: { x: 42, y: 30, width: 6, height: 16 },
        // Legs
        leftLeg: { x: 24, y: 48, width: 8, height: 20 },
        rightLeg: { x: 32, y: 48, width: 8, height: 20 },
        // Hands
        leftHand: { x: 14, y: 44, width: 4, height: 4 },
        rightHand: { x: 46, y: 44, width: 4, height: 4 },
        // Feet (will be covered by boots usually)
        leftFoot: { x: 22, y: 68, width: 10, height: 6 },
        rightFoot: { x: 32, y: 68, width: 10, height: 6 }
    }
};

// Animation frames for idle breathing/movement
const ANIMATION = {
    breathingOffsets: [
        { torso: 0, head: 0, arms: 0 },
        { torso: 0, head: -0.5, arms: 0.5 },
        { torso: 0.5, head: -0.5, arms: 0.5 },
        { torso: 0.5, head: 0, arms: 0 },
        { torso: 0, head: 0, arms: -0.5 },
        { torso: -0.5, head: 0.5, arms: -0.5 },
        { torso: -0.5, head: 0, arms: 0 },
        { torso: 0, head: 0, arms: 0 }
    ],
    frameRate: 150, // ms per frame
    cloakSway: [0, 1, 2, 1, 0, -1, -2, -1]
};

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SCALE, BASE_WIDTH, BASE_HEIGHT, COLORS, CHARACTER_PARTS, PIXEL_DATA, ANIMATION };
}
