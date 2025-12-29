// Pixel Art Sprite System for Dark Fantasy Character Creator
// High-quality 32x32 base sprites with proper shading

const SPRITE_CONFIG = {
    baseSize: 32, // Base sprite size
    scale: 6,     // Scale factor for main display
    thumbScale: 2, // Scale for thumbnails
    canvasWidth: 300,
    canvasHeight: 400
};

// Color palettes
const PALETTES = {
    // Skin tones
    skin: {
        human: { base: '#d4a574', shadow: '#b8876a', dark: '#8c6048', highlight: '#e8c8a8', outline: '#5a3a28' },
        pale: { base: '#c8b8a8', shadow: '#a89888', dark: '#887868', highlight: '#e0d4c8', outline: '#4a3a30' },
        hollow: { base: '#8a7a6a', shadow: '#6a5a4a', dark: '#4a3a2a', highlight: '#a89a8a', outline: '#2a1a10' },
        undead: { base: '#6a6058', shadow: '#4a4038', dark: '#2a2018', highlight: '#8a8078', outline: '#1a1008' },
        ashen: { base: '#7a7068', shadow: '#5a5048', dark: '#3a3028', highlight: '#9a9088', outline: '#2a2018' },
        cursed: { base: '#5a4848', shadow: '#3a2828', dark: '#2a1818', highlight: '#7a6868', outline: '#1a0808' }
    },
    // Metal colors
    metal: {
        iron: { base: '#6a6a68', shadow: '#4a4a48', dark: '#2a2a28', highlight: '#8a8a88', outline: '#1a1a18' },
        steel: { base: '#8a8a88', shadow: '#6a6a68', dark: '#4a4a48', highlight: '#aaaaaa', outline: '#2a2a28' },
        dark: { base: '#3a3a38', shadow: '#2a2a28', dark: '#1a1a18', highlight: '#5a5a58', outline: '#0a0a08' },
        gold: { base: '#c8a830', shadow: '#a08020', dark: '#786010', highlight: '#e8d060', outline: '#504008' },
        bronze: { base: '#a87830', shadow: '#886020', dark: '#684810', highlight: '#c89850', outline: '#483008' },
        rust: { base: '#8a5030', shadow: '#6a3820', dark: '#4a2010', highlight: '#aa7050', outline: '#3a1808' }
    },
    // Fabric/leather colors
    fabric: {
        brown: { base: '#6a4830', shadow: '#4a3020', dark: '#2a1810', highlight: '#8a6850', outline: '#1a0808' },
        black: { base: '#2a2828', shadow: '#1a1818', dark: '#0a0808', highlight: '#4a4848', outline: '#000000' },
        grey: { base: '#5a5858', shadow: '#3a3838', dark: '#2a2828', highlight: '#7a7878', outline: '#1a1818' },
        red: { base: '#8a2020', shadow: '#6a1010', dark: '#4a0808', highlight: '#aa4040', outline: '#2a0000' },
        purple: { base: '#5a3060', shadow: '#3a1840', dark: '#2a0830', highlight: '#7a5080', outline: '#1a0020' },
        green: { base: '#2a5030', shadow: '#183820', dark: '#082010', highlight: '#4a7050', outline: '#001008' },
        white: { base: '#d0d0d0', shadow: '#a0a0a0', dark: '#808080', highlight: '#f0f0f0', outline: '#606060' }
    },
    // Hair colors
    hair: {
        black: { base: '#2a2420', shadow: '#1a1410', dark: '#0a0400', highlight: '#3a3430', outline: '#000000' },
        brown: { base: '#5a4030', shadow: '#3a2820', dark: '#2a1810', highlight: '#7a6050', outline: '#1a0800' },
        grey: { base: '#6a6868', shadow: '#4a4848', dark: '#3a3838', highlight: '#8a8888', outline: '#2a2828' },
        white: { base: '#c8c8c8', shadow: '#a8a8a8', dark: '#888888', highlight: '#e8e8e8', outline: '#686868' },
        red: { base: '#8a3020', shadow: '#6a2010', dark: '#4a1008', highlight: '#aa5040', outline: '#2a0800' },
        blonde: { base: '#c8a040', shadow: '#a88030', dark: '#886020', highlight: '#e8c060', outline: '#684010' }
    },
    // Effect colors
    effects: {
        ember: { base: '#ff8030', shadow: '#e06020', dark: '#c04010', highlight: '#ffa050', glow: '#ff6010' },
        curse: { base: '#8040a0', shadow: '#603080', dark: '#402060', highlight: '#a060c0', glow: '#6020a0' },
        blood: { base: '#8a1010', shadow: '#6a0808', dark: '#4a0000', highlight: '#aa3030' },
        holy: { base: '#f0e0a0', shadow: '#d0c080', dark: '#b0a060', highlight: '#fff0c0', glow: '#ffe080' }
    }
};

// Character part options
const CHARACTER_OPTIONS = {
    skin: [
        { id: 'human', name: 'Human', palette: 'human' },
        { id: 'pale', name: 'Pale', palette: 'pale' },
        { id: 'hollow', name: 'Hollow', palette: 'hollow' },
        { id: 'undead', name: 'Undead', palette: 'undead' },
        { id: 'ashen', name: 'Ashen', palette: 'ashen' },
        { id: 'cursed', name: 'Cursed', palette: 'cursed' }
    ],
    build: [
        { id: 'normal', name: 'Normal' },
        { id: 'slim', name: 'Slim' },
        { id: 'heavy', name: 'Heavy' }
    ],
    face: [
        { id: 'normal', name: 'Normal' },
        { id: 'gaunt', name: 'Gaunt' },
        { id: 'scarred', name: 'Scarred' },
        { id: 'hollow', name: 'Hollow' },
        { id: 'skull', name: 'Skull' },
        { id: 'noble', name: 'Noble' }
    ],
    hair: [
        { id: 'none', name: 'None' },
        { id: 'short', name: 'Short', color: 'black' },
        { id: 'messy', name: 'Messy', color: 'brown' },
        { id: 'long', name: 'Long', color: 'black' },
        { id: 'slicked', name: 'Slicked', color: 'black' },
        { id: 'wild', name: 'Wild', color: 'grey' },
        { id: 'aged', name: 'Aged', color: 'white' }
    ],
    helm: [
        { id: 'none', name: 'None' },
        { id: 'knight', name: 'Knight' },
        { id: 'bucket', name: 'Bucket' },
        { id: 'armet', name: 'Armet' },
        { id: 'barbute', name: 'Barbute' },
        { id: 'crown', name: 'Crown' },
        { id: 'hood', name: 'Hood' },
        { id: 'mask', name: 'Mask' }
    ],
    chest: [
        { id: 'rags', name: 'Rags' },
        { id: 'tunic', name: 'Tunic' },
        { id: 'leather', name: 'Leather' },
        { id: 'chain', name: 'Chainmail' },
        { id: 'plate', name: 'Plate' },
        { id: 'knight', name: 'Knight' },
        { id: 'elite', name: 'Elite' },
        { id: 'dark', name: 'Dark' }
    ],
    legs: [
        { id: 'rags', name: 'Rags' },
        { id: 'cloth', name: 'Cloth' },
        { id: 'leather', name: 'Leather' },
        { id: 'chain', name: 'Chainmail' },
        { id: 'plate', name: 'Plate' },
        { id: 'knight', name: 'Knight' }
    ],
    boots: [
        { id: 'bare', name: 'Barefoot' },
        { id: 'wraps', name: 'Wraps' },
        { id: 'leather', name: 'Leather' },
        { id: 'iron', name: 'Iron' },
        { id: 'knight', name: 'Knight' },
        { id: 'plated', name: 'Plated' }
    ],
    cape: [
        { id: 'none', name: 'None' },
        { id: 'tattered', name: 'Tattered' },
        { id: 'short', name: 'Short' },
        { id: 'long', name: 'Long' },
        { id: 'hooded', name: 'Hooded' },
        { id: 'royal', name: 'Royal' }
    ],
    weapon: [
        { id: 'none', name: 'None' },
        { id: 'sword', name: 'Sword' },
        { id: 'greatsword', name: 'Greatsword' },
        { id: 'axe', name: 'Axe' },
        { id: 'spear', name: 'Spear' },
        { id: 'katana', name: 'Katana' },
        { id: 'mace', name: 'Mace' },
        { id: 'scythe', name: 'Scythe' },
        { id: 'staff', name: 'Staff' }
    ],
    shield: [
        { id: 'none', name: 'None' },
        { id: 'buckler', name: 'Buckler' },
        { id: 'kite', name: 'Kite' },
        { id: 'tower', name: 'Tower' },
        { id: 'crest', name: 'Crest' },
        { id: 'skull', name: 'Skull' }
    ],
    scars: [
        { id: 'none', name: 'None' },
        { id: 'face', name: 'Face Scar' },
        { id: 'burns', name: 'Burns' },
        { id: 'decay', name: 'Decay' },
        { id: 'brand', name: 'Brand' }
    ],
    effects: [
        { id: 'none', name: 'None' },
        { id: 'ember', name: 'Ember' },
        { id: 'curse', name: 'Curse' },
        { id: 'blood', name: 'Blood' },
        { id: 'souls', name: 'Souls' }
    ],
    background: [
        { id: 'void', name: 'Void' },
        { id: 'bonfire', name: 'Bonfire' },
        { id: 'ruins', name: 'Ruins' },
        { id: 'castle', name: 'Castle' },
        { id: 'fog', name: 'Fog Gate' },
        { id: 'abyss', name: 'Abyss' },
        { id: 'shrine', name: 'Shrine' }
    ]
};

// Sprite drawing class
class SpriteRenderer {
    constructor() {
        this.pixelSize = 1;
    }

    // Set pixel with optional alpha
    setPixel(ctx, x, y, color, alpha = 1) {
        if (alpha < 1) {
            ctx.globalAlpha = alpha;
        }
        ctx.fillStyle = color;
        ctx.fillRect(x * this.pixelSize, y * this.pixelSize, this.pixelSize, this.pixelSize);
        if (alpha < 1) {
            ctx.globalAlpha = 1;
        }
    }

    // Draw a filled rectangle in pixel coordinates
    rect(ctx, x, y, w, h, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * this.pixelSize, y * this.pixelSize, w * this.pixelSize, h * this.pixelSize);
    }

    // Draw outlined shape
    outlinedRect(ctx, x, y, w, h, fillColor, outlineColor) {
        // Outline
        ctx.fillStyle = outlineColor;
        ctx.fillRect(x * this.pixelSize, y * this.pixelSize, w * this.pixelSize, h * this.pixelSize);
        // Fill (1px inset)
        ctx.fillStyle = fillColor;
        ctx.fillRect((x + 1) * this.pixelSize, (y + 1) * this.pixelSize, (w - 2) * this.pixelSize, (h - 2) * this.pixelSize);
    }

    // Draw character body (base humanoid shape)
    drawBody(ctx, skin, build, offsetY = 0) {
        const p = PALETTES.skin[skin] || PALETTES.skin.hollow;
        const baseX = 15; // Center of 32-width canvas for thumbnails, adjusted for full
        const baseY = 8 + offsetY;

        // Build adjustments
        let bodyWidth = build === 'slim' ? 8 : (build === 'heavy' ? 12 : 10);
        let shoulderWidth = build === 'slim' ? 10 : (build === 'heavy' ? 16 : 12);

        // Head
        this.rect(ctx, baseX - 4, baseY, 8, 8, p.outline);
        this.rect(ctx, baseX - 3, baseY + 1, 6, 6, p.shadow);
        this.rect(ctx, baseX - 3, baseY + 1, 5, 5, p.base);
        this.rect(ctx, baseX - 2, baseY + 2, 3, 3, p.highlight);

        // Neck
        this.rect(ctx, baseX - 1, baseY + 8, 2, 2, p.shadow);

        // Torso
        const torsoX = baseX - Math.floor(bodyWidth / 2);
        this.rect(ctx, torsoX - 1, baseY + 9, bodyWidth + 2, 10, p.outline);
        this.rect(ctx, torsoX, baseY + 10, bodyWidth, 8, p.shadow);
        this.rect(ctx, torsoX, baseY + 10, bodyWidth - 1, 7, p.base);

        // Arms
        this.rect(ctx, torsoX - 3, baseY + 10, 3, 8, p.outline);
        this.rect(ctx, torsoX - 2, baseY + 11, 2, 6, p.shadow);
        this.rect(ctx, torsoX + bodyWidth, baseY + 10, 3, 8, p.outline);
        this.rect(ctx, torsoX + bodyWidth, baseY + 11, 2, 6, p.shadow);

        // Hands
        this.rect(ctx, torsoX - 3, baseY + 18, 3, 3, p.outline);
        this.rect(ctx, torsoX - 2, baseY + 18, 2, 2, p.base);
        this.rect(ctx, torsoX + bodyWidth, baseY + 18, 3, 3, p.outline);
        this.rect(ctx, torsoX + bodyWidth + 1, baseY + 18, 2, 2, p.base);

        // Legs
        this.rect(ctx, baseX - 3, baseY + 19, 3, 10, p.outline);
        this.rect(ctx, baseX - 2, baseY + 20, 2, 8, p.shadow);
        this.rect(ctx, baseX, baseY + 19, 3, 10, p.outline);
        this.rect(ctx, baseX, baseY + 20, 2, 8, p.shadow);

        return { baseX, baseY, bodyWidth };
    }

    // Draw face details
    drawFace(ctx, type, skin, baseX, baseY) {
        const p = PALETTES.skin[skin] || PALETTES.skin.hollow;

        switch (type) {
            case 'normal':
                // Eyes
                this.setPixel(ctx, baseX - 2, baseY + 3, '#1a1a18');
                this.setPixel(ctx, baseX + 1, baseY + 3, '#1a1a18');
                // Mouth
                this.rect(ctx, baseX - 1, baseY + 5, 2, 1, p.shadow);
                break;

            case 'gaunt':
                // Sunken eyes
                this.rect(ctx, baseX - 3, baseY + 2, 2, 2, '#0a0808');
                this.rect(ctx, baseX + 1, baseY + 2, 2, 2, '#0a0808');
                this.setPixel(ctx, baseX - 2, baseY + 3, '#2a1a10');
                this.setPixel(ctx, baseX + 1, baseY + 3, '#2a1a10');
                // Hollow cheeks
                this.setPixel(ctx, baseX - 3, baseY + 4, p.dark);
                this.setPixel(ctx, baseX + 2, baseY + 4, p.dark);
                break;

            case 'scarred':
                // Normal eyes
                this.setPixel(ctx, baseX - 2, baseY + 3, '#1a1a18');
                this.setPixel(ctx, baseX + 1, baseY + 3, '#3a2020');
                // Scar
                this.setPixel(ctx, baseX + 1, baseY + 2, '#6a3030');
                this.setPixel(ctx, baseX + 1, baseY + 4, '#6a3030');
                this.setPixel(ctx, baseX + 2, baseY + 5, '#6a3030');
                break;

            case 'hollow':
                // Glowing eyes
                this.rect(ctx, baseX - 3, baseY + 2, 2, 2, '#000000');
                this.rect(ctx, baseX + 1, baseY + 2, 2, 2, '#000000');
                this.setPixel(ctx, baseX - 2, baseY + 3, '#c89030');
                this.setPixel(ctx, baseX + 1, baseY + 3, '#c89030');
                break;

            case 'skull':
                // Empty sockets
                this.rect(ctx, baseX - 3, baseY + 2, 2, 2, '#000000');
                this.rect(ctx, baseX + 1, baseY + 2, 2, 2, '#000000');
                // Nose hole
                this.setPixel(ctx, baseX - 1, baseY + 4, '#000000');
                this.setPixel(ctx, baseX, baseY + 4, '#000000');
                // Teeth
                this.rect(ctx, baseX - 2, baseY + 5, 4, 1, p.highlight);
                break;

            case 'noble':
                // Refined eyes
                this.setPixel(ctx, baseX - 2, baseY + 3, '#2a2a28');
                this.setPixel(ctx, baseX + 1, baseY + 3, '#2a2a28');
                // Eyebrows
                this.rect(ctx, baseX - 3, baseY + 2, 2, 1, p.dark);
                this.rect(ctx, baseX + 1, baseY + 2, 2, 1, p.dark);
                break;
        }
    }

    // Draw hair
    drawHair(ctx, type, colorName, baseX, baseY) {
        if (type === 'none') return;

        const p = PALETTES.hair[colorName] || PALETTES.hair.black;

        switch (type) {
            case 'short':
                this.rect(ctx, baseX - 4, baseY - 1, 8, 4, p.outline);
                this.rect(ctx, baseX - 3, baseY, 6, 2, p.base);
                this.rect(ctx, baseX - 2, baseY, 4, 1, p.highlight);
                break;

            case 'messy':
                this.rect(ctx, baseX - 5, baseY - 2, 10, 5, p.outline);
                this.rect(ctx, baseX - 4, baseY - 1, 8, 4, p.base);
                this.setPixel(ctx, baseX - 5, baseY, p.base);
                this.setPixel(ctx, baseX + 4, baseY - 1, p.base);
                this.setPixel(ctx, baseX - 3, baseY - 2, p.base);
                this.rect(ctx, baseX - 3, baseY - 1, 5, 2, p.highlight);
                break;

            case 'long':
                this.rect(ctx, baseX - 4, baseY - 1, 8, 4, p.outline);
                this.rect(ctx, baseX - 3, baseY, 6, 3, p.base);
                // Side hair
                this.rect(ctx, baseX - 5, baseY + 3, 2, 8, p.outline);
                this.rect(ctx, baseX - 4, baseY + 4, 1, 6, p.base);
                this.rect(ctx, baseX + 3, baseY + 3, 2, 8, p.outline);
                this.rect(ctx, baseX + 3, baseY + 4, 1, 6, p.base);
                break;

            case 'slicked':
                this.rect(ctx, baseX - 4, baseY - 1, 8, 3, p.outline);
                this.rect(ctx, baseX - 3, baseY, 6, 2, p.base);
                this.rect(ctx, baseX - 2, baseY, 4, 1, p.highlight);
                break;

            case 'wild':
                this.rect(ctx, baseX - 5, baseY - 3, 10, 6, p.outline);
                this.rect(ctx, baseX - 4, baseY - 2, 8, 5, p.base);
                // Spikes
                this.setPixel(ctx, baseX - 4, baseY - 3, p.base);
                this.setPixel(ctx, baseX, baseY - 4, p.base);
                this.setPixel(ctx, baseX + 3, baseY - 3, p.base);
                this.rect(ctx, baseX - 3, baseY - 1, 5, 2, p.highlight);
                break;

            case 'aged':
                this.rect(ctx, baseX - 4, baseY - 1, 8, 4, p.outline);
                this.rect(ctx, baseX - 3, baseY, 6, 3, p.base);
                this.rect(ctx, baseX - 2, baseY, 4, 2, p.highlight);
                // Thin wisps
                this.rect(ctx, baseX - 5, baseY + 3, 2, 6, p.outline);
                this.rect(ctx, baseX - 4, baseY + 4, 1, 4, p.base);
                this.rect(ctx, baseX + 3, baseY + 3, 2, 6, p.outline);
                this.rect(ctx, baseX + 3, baseY + 4, 1, 4, p.base);
                break;
        }
    }

    // Draw helmet
    drawHelm(ctx, type, baseX, baseY) {
        if (type === 'none') return;

        const p = PALETTES.metal.iron;

        switch (type) {
            case 'knight':
                // Full helm
                this.rect(ctx, baseX - 5, baseY - 1, 10, 10, p.outline);
                this.rect(ctx, baseX - 4, baseY, 8, 8, p.shadow);
                this.rect(ctx, baseX - 4, baseY, 7, 7, p.base);
                this.rect(ctx, baseX - 3, baseY + 1, 4, 3, p.highlight);
                // Visor slit
                this.rect(ctx, baseX - 3, baseY + 3, 6, 1, '#0a0808');
                // Top ridge
                this.rect(ctx, baseX - 1, baseY - 2, 2, 2, p.base);
                break;

            case 'bucket':
                // Flat top bucket
                this.rect(ctx, baseX - 5, baseY - 2, 10, 11, p.outline);
                this.rect(ctx, baseX - 4, baseY - 1, 8, 9, p.shadow);
                this.rect(ctx, baseX - 4, baseY - 1, 7, 8, p.base);
                // Eye slits
                this.rect(ctx, baseX - 3, baseY + 2, 2, 1, '#0a0808');
                this.rect(ctx, baseX + 1, baseY + 2, 2, 1, '#0a0808');
                // Breathing holes
                this.setPixel(ctx, baseX - 2, baseY + 5, '#0a0808');
                this.setPixel(ctx, baseX, baseY + 5, '#0a0808');
                this.setPixel(ctx, baseX + 1, baseY + 5, '#0a0808');
                break;

            case 'armet':
                // Pointed visor helm
                this.rect(ctx, baseX - 5, baseY - 1, 10, 10, p.outline);
                this.rect(ctx, baseX - 4, baseY, 8, 8, p.shadow);
                this.rect(ctx, baseX - 4, baseY, 7, 7, p.base);
                // Visor
                this.rect(ctx, baseX - 3, baseY + 3, 7, 3, p.shadow);
                this.rect(ctx, baseX - 2, baseY + 3, 5, 2, p.base);
                this.rect(ctx, baseX - 2, baseY + 4, 5, 1, '#0a0808');
                // Crest
                this.rect(ctx, baseX - 1, baseY - 3, 2, 3, p.base);
                break;

            case 'barbute':
                // Y-shaped opening
                this.rect(ctx, baseX - 5, baseY - 1, 10, 10, p.outline);
                this.rect(ctx, baseX - 4, baseY, 8, 8, p.shadow);
                this.rect(ctx, baseX - 4, baseY, 7, 7, p.base);
                // Face opening
                this.rect(ctx, baseX - 1, baseY + 2, 2, 6, '#0a0808');
                this.rect(ctx, baseX - 2, baseY + 2, 4, 2, '#0a0808');
                break;

            case 'crown':
                const g = PALETTES.metal.gold;
                // Broken crown
                this.rect(ctx, baseX - 4, baseY - 1, 8, 3, g.outline);
                this.rect(ctx, baseX - 3, baseY, 6, 2, g.base);
                // Points
                this.rect(ctx, baseX - 3, baseY - 3, 2, 3, g.base);
                this.rect(ctx, baseX, baseY - 4, 2, 4, g.base);
                // Broken point
                this.setPixel(ctx, baseX + 2, baseY - 2, g.shadow);
                // Gems
                this.setPixel(ctx, baseX - 2, baseY, '#8a2020');
                this.setPixel(ctx, baseX + 1, baseY, '#206080');
                break;

            case 'hood':
                const f = PALETTES.fabric.brown;
                // Leather hood
                this.rect(ctx, baseX - 5, baseY - 2, 10, 11, f.outline);
                this.rect(ctx, baseX - 4, baseY - 1, 8, 9, f.shadow);
                this.rect(ctx, baseX - 4, baseY - 1, 7, 8, f.base);
                // Face opening
                this.rect(ctx, baseX - 2, baseY + 2, 5, 5, '#0a0808');
                break;

            case 'mask':
                // Skull mask
                const bone = { base: '#c8c0b8', shadow: '#a8a098', outline: '#686058' };
                this.rect(ctx, baseX - 4, baseY, 8, 7, bone.outline);
                this.rect(ctx, baseX - 3, baseY + 1, 6, 5, bone.base);
                // Eye holes
                this.rect(ctx, baseX - 3, baseY + 1, 2, 2, '#000000');
                this.rect(ctx, baseX + 1, baseY + 1, 2, 2, '#000000');
                // Nose
                this.setPixel(ctx, baseX - 1, baseY + 3, '#000000');
                this.setPixel(ctx, baseX, baseY + 3, '#000000');
                // Teeth
                this.rect(ctx, baseX - 2, baseY + 5, 4, 1, bone.shadow);
                break;
        }
    }

    // Draw chest armor
    drawChest(ctx, type, baseX, baseY, bodyWidth) {
        const torsoX = baseX - Math.floor(bodyWidth / 2);

        switch (type) {
            case 'rags':
                const r = PALETTES.fabric.brown;
                this.rect(ctx, torsoX, baseY + 10, bodyWidth, 8, r.shadow);
                this.rect(ctx, torsoX + 1, baseY + 11, bodyWidth - 2, 6, r.base);
                // Torn edges
                this.setPixel(ctx, torsoX, baseY + 16, r.outline);
                this.setPixel(ctx, torsoX + bodyWidth - 1, baseY + 17, r.outline);
                break;

            case 'tunic':
                const t = PALETTES.fabric.grey;
                this.rect(ctx, torsoX - 1, baseY + 9, bodyWidth + 2, 10, t.outline);
                this.rect(ctx, torsoX, baseY + 10, bodyWidth, 8, t.base);
                this.rect(ctx, torsoX + 1, baseY + 11, bodyWidth - 2, 5, t.highlight);
                break;

            case 'leather':
                const l = PALETTES.fabric.brown;
                this.rect(ctx, torsoX - 1, baseY + 9, bodyWidth + 2, 10, l.outline);
                this.rect(ctx, torsoX, baseY + 10, bodyWidth, 8, l.shadow);
                this.rect(ctx, torsoX + 1, baseY + 10, bodyWidth - 2, 6, l.base);
                // Straps
                this.rect(ctx, torsoX + 2, baseY + 10, 1, 8, l.dark);
                this.rect(ctx, torsoX + bodyWidth - 3, baseY + 10, 1, 8, l.dark);
                break;

            case 'chain':
                const c = PALETTES.metal.iron;
                this.rect(ctx, torsoX - 1, baseY + 9, bodyWidth + 2, 10, c.outline);
                this.rect(ctx, torsoX, baseY + 10, bodyWidth, 8, c.shadow);
                // Chain pattern
                for (let y = 0; y < 4; y++) {
                    for (let x = 0; x < bodyWidth - 2; x++) {
                        if ((x + y) % 2 === 0) {
                            this.setPixel(ctx, torsoX + 1 + x, baseY + 11 + y * 2, c.base);
                        }
                    }
                }
                break;

            case 'plate':
                const pl = PALETTES.metal.steel;
                this.rect(ctx, torsoX - 2, baseY + 9, bodyWidth + 4, 10, pl.outline);
                this.rect(ctx, torsoX - 1, baseY + 10, bodyWidth + 2, 8, pl.shadow);
                this.rect(ctx, torsoX, baseY + 10, bodyWidth, 7, pl.base);
                this.rect(ctx, torsoX + 1, baseY + 11, bodyWidth - 2, 3, pl.highlight);
                // Shoulder plates
                this.rect(ctx, torsoX - 4, baseY + 9, 4, 4, pl.outline);
                this.rect(ctx, torsoX - 3, baseY + 10, 3, 2, pl.base);
                this.rect(ctx, torsoX + bodyWidth, baseY + 9, 4, 4, pl.outline);
                this.rect(ctx, torsoX + bodyWidth, baseY + 10, 3, 2, pl.base);
                break;

            case 'knight':
                const k = PALETTES.metal.steel;
                this.rect(ctx, torsoX - 2, baseY + 9, bodyWidth + 4, 10, k.outline);
                this.rect(ctx, torsoX - 1, baseY + 10, bodyWidth + 2, 8, k.shadow);
                this.rect(ctx, torsoX, baseY + 10, bodyWidth, 7, k.base);
                // Cross emblem
                this.rect(ctx, baseX - 1, baseY + 11, 2, 5, PALETTES.fabric.red.base);
                this.rect(ctx, baseX - 2, baseY + 13, 4, 1, PALETTES.fabric.red.base);
                // Large shoulders
                this.rect(ctx, torsoX - 5, baseY + 8, 5, 5, k.outline);
                this.rect(ctx, torsoX - 4, baseY + 9, 4, 3, k.base);
                this.rect(ctx, torsoX + bodyWidth, baseY + 8, 5, 5, k.outline);
                this.rect(ctx, torsoX + bodyWidth, baseY + 9, 4, 3, k.base);
                break;

            case 'elite':
                const e = PALETTES.metal.steel;
                this.rect(ctx, torsoX - 2, baseY + 9, bodyWidth + 4, 10, e.outline);
                this.rect(ctx, torsoX - 1, baseY + 10, bodyWidth + 2, 8, e.shadow);
                this.rect(ctx, torsoX, baseY + 10, bodyWidth, 7, e.base);
                // Gold trim
                this.rect(ctx, torsoX, baseY + 10, bodyWidth, 1, PALETTES.metal.gold.base);
                this.rect(ctx, torsoX, baseY + 17, bodyWidth, 1, PALETTES.metal.gold.base);
                // Ornate shoulders
                this.rect(ctx, torsoX - 5, baseY + 7, 6, 6, e.outline);
                this.rect(ctx, torsoX - 4, baseY + 8, 5, 4, e.base);
                this.setPixel(ctx, torsoX - 3, baseY + 9, PALETTES.metal.gold.base);
                this.rect(ctx, torsoX + bodyWidth - 1, baseY + 7, 6, 6, e.outline);
                this.rect(ctx, torsoX + bodyWidth - 1, baseY + 8, 5, 4, e.base);
                this.setPixel(ctx, torsoX + bodyWidth + 2, baseY + 9, PALETTES.metal.gold.base);
                break;

            case 'dark':
                const d = PALETTES.metal.dark;
                this.rect(ctx, torsoX - 2, baseY + 9, bodyWidth + 4, 10, d.outline);
                this.rect(ctx, torsoX - 1, baseY + 10, bodyWidth + 2, 8, d.shadow);
                this.rect(ctx, torsoX, baseY + 10, bodyWidth, 7, d.base);
                // Spikes
                this.rect(ctx, torsoX - 5, baseY + 8, 5, 5, d.outline);
                this.rect(ctx, torsoX - 4, baseY + 9, 4, 3, d.base);
                this.setPixel(ctx, torsoX - 5, baseY + 6, d.base);
                this.rect(ctx, torsoX + bodyWidth, baseY + 8, 5, 5, d.outline);
                this.rect(ctx, torsoX + bodyWidth, baseY + 9, 4, 3, d.base);
                this.setPixel(ctx, torsoX + bodyWidth + 4, baseY + 6, d.base);
                break;
        }
    }

    // Draw legs armor
    drawLegs(ctx, type, baseX, baseY) {
        switch (type) {
            case 'rags':
                const r = PALETTES.fabric.brown;
                this.rect(ctx, baseX - 3, baseY + 19, 3, 10, r.outline);
                this.rect(ctx, baseX - 2, baseY + 20, 2, 8, r.base);
                this.rect(ctx, baseX, baseY + 19, 3, 10, r.outline);
                this.rect(ctx, baseX, baseY + 20, 2, 8, r.base);
                break;

            case 'cloth':
                const c = PALETTES.fabric.grey;
                this.rect(ctx, baseX - 3, baseY + 19, 3, 10, c.outline);
                this.rect(ctx, baseX - 2, baseY + 20, 2, 8, c.base);
                this.rect(ctx, baseX, baseY + 19, 3, 10, c.outline);
                this.rect(ctx, baseX, baseY + 20, 2, 8, c.base);
                break;

            case 'leather':
                const l = PALETTES.fabric.brown;
                this.rect(ctx, baseX - 3, baseY + 19, 3, 10, l.outline);
                this.rect(ctx, baseX - 2, baseY + 20, 2, 8, l.shadow);
                this.rect(ctx, baseX - 2, baseY + 20, 1, 6, l.base);
                this.rect(ctx, baseX, baseY + 19, 3, 10, l.outline);
                this.rect(ctx, baseX, baseY + 20, 2, 8, l.shadow);
                this.rect(ctx, baseX + 1, baseY + 20, 1, 6, l.base);
                break;

            case 'chain':
                const ch = PALETTES.metal.iron;
                this.rect(ctx, baseX - 3, baseY + 19, 3, 10, ch.outline);
                this.rect(ctx, baseX - 2, baseY + 20, 2, 8, ch.shadow);
                this.rect(ctx, baseX, baseY + 19, 3, 10, ch.outline);
                this.rect(ctx, baseX, baseY + 20, 2, 8, ch.shadow);
                break;

            case 'plate':
            case 'knight':
                const p = PALETTES.metal.steel;
                this.rect(ctx, baseX - 4, baseY + 19, 4, 10, p.outline);
                this.rect(ctx, baseX - 3, baseY + 20, 3, 8, p.shadow);
                this.rect(ctx, baseX - 3, baseY + 20, 2, 6, p.base);
                this.rect(ctx, baseX, baseY + 19, 4, 10, p.outline);
                this.rect(ctx, baseX + 1, baseY + 20, 3, 8, p.shadow);
                this.rect(ctx, baseX + 1, baseY + 20, 2, 6, p.base);
                break;
        }
    }

    // Draw boots
    drawBoots(ctx, type, skin, baseX, baseY) {
        switch (type) {
            case 'bare':
                const s = PALETTES.skin[skin] || PALETTES.skin.hollow;
                this.rect(ctx, baseX - 3, baseY + 28, 4, 3, s.outline);
                this.rect(ctx, baseX - 2, baseY + 28, 3, 2, s.base);
                this.rect(ctx, baseX, baseY + 28, 4, 3, s.outline);
                this.rect(ctx, baseX, baseY + 28, 3, 2, s.base);
                break;

            case 'wraps':
                const w = PALETTES.fabric.brown;
                this.rect(ctx, baseX - 3, baseY + 26, 4, 5, w.outline);
                this.rect(ctx, baseX - 2, baseY + 27, 3, 3, w.base);
                this.rect(ctx, baseX, baseY + 26, 4, 5, w.outline);
                this.rect(ctx, baseX, baseY + 27, 3, 3, w.base);
                break;

            case 'leather':
                const l = PALETTES.fabric.brown;
                this.rect(ctx, baseX - 4, baseY + 25, 5, 6, l.outline);
                this.rect(ctx, baseX - 3, baseY + 26, 4, 4, l.shadow);
                this.rect(ctx, baseX - 3, baseY + 26, 3, 3, l.base);
                this.rect(ctx, baseX, baseY + 25, 5, 6, l.outline);
                this.rect(ctx, baseX + 1, baseY + 26, 4, 4, l.shadow);
                this.rect(ctx, baseX + 1, baseY + 26, 3, 3, l.base);
                break;

            case 'iron':
            case 'knight':
            case 'plated':
                const p = PALETTES.metal.steel;
                this.rect(ctx, baseX - 4, baseY + 24, 5, 7, p.outline);
                this.rect(ctx, baseX - 3, baseY + 25, 4, 5, p.shadow);
                this.rect(ctx, baseX - 3, baseY + 25, 3, 4, p.base);
                this.rect(ctx, baseX, baseY + 24, 5, 7, p.outline);
                this.rect(ctx, baseX + 1, baseY + 25, 4, 5, p.shadow);
                this.rect(ctx, baseX + 1, baseY + 25, 3, 4, p.base);
                break;
        }
    }

    // Draw cape
    drawCape(ctx, type, baseX, baseY, isBehind = true) {
        if (type === 'none') return;

        const c = PALETTES.fabric.black;

        if (isBehind) {
            switch (type) {
                case 'tattered':
                    this.rect(ctx, baseX - 6, baseY + 9, 12, 20, c.outline);
                    this.rect(ctx, baseX - 5, baseY + 10, 10, 18, c.shadow);
                    this.rect(ctx, baseX - 4, baseY + 10, 8, 16, c.base);
                    // Tears
                    this.rect(ctx, baseX - 5, baseY + 24, 2, 4, c.outline);
                    this.rect(ctx, baseX + 2, baseY + 22, 2, 6, c.outline);
                    break;

                case 'short':
                    this.rect(ctx, baseX - 5, baseY + 9, 10, 8, c.outline);
                    this.rect(ctx, baseX - 4, baseY + 10, 8, 6, c.shadow);
                    this.rect(ctx, baseX - 3, baseY + 10, 6, 5, c.base);
                    break;

                case 'long':
                    this.rect(ctx, baseX - 6, baseY + 9, 12, 22, c.outline);
                    this.rect(ctx, baseX - 5, baseY + 10, 10, 20, c.shadow);
                    this.rect(ctx, baseX - 4, baseY + 10, 8, 18, c.base);
                    break;

                case 'hooded':
                    this.rect(ctx, baseX - 6, baseY + 6, 12, 25, c.outline);
                    this.rect(ctx, baseX - 5, baseY + 7, 10, 23, c.shadow);
                    this.rect(ctx, baseX - 4, baseY + 7, 8, 21, c.base);
                    break;

                case 'royal':
                    const royal = PALETTES.fabric.red;
                    this.rect(ctx, baseX - 7, baseY + 9, 14, 24, royal.outline);
                    this.rect(ctx, baseX - 6, baseY + 10, 12, 22, royal.shadow);
                    this.rect(ctx, baseX - 5, baseY + 10, 10, 20, royal.base);
                    // Gold trim
                    this.rect(ctx, baseX - 6, baseY + 10, 1, 22, PALETTES.metal.gold.base);
                    this.rect(ctx, baseX + 5, baseY + 10, 1, 22, PALETTES.metal.gold.base);
                    break;
            }
        }

        // Front clasp
        if (!isBehind && type !== 'none') {
            const gold = PALETTES.metal.gold;
            this.rect(ctx, baseX - 2, baseY + 9, 4, 2, gold.outline);
            this.rect(ctx, baseX - 1, baseY + 9, 2, 1, gold.base);
        }
    }

    // Draw weapon
    drawWeapon(ctx, type, baseX, baseY) {
        if (type === 'none') return;

        const m = PALETTES.metal.steel;
        const h = PALETTES.fabric.brown;
        const weaponX = baseX + 8;
        const weaponY = baseY + 14;

        switch (type) {
            case 'sword':
                // Handle
                this.rect(ctx, weaponX, weaponY + 8, 2, 6, h.outline);
                this.rect(ctx, weaponX, weaponY + 9, 2, 4, h.base);
                // Guard
                this.rect(ctx, weaponX - 2, weaponY + 6, 6, 2, m.outline);
                this.rect(ctx, weaponX - 1, weaponY + 7, 4, 1, m.base);
                // Blade
                this.rect(ctx, weaponX, weaponY - 10, 2, 16, m.outline);
                this.rect(ctx, weaponX, weaponY - 9, 2, 14, m.shadow);
                this.rect(ctx, weaponX, weaponY - 8, 1, 12, m.base);
                this.rect(ctx, weaponX, weaponY - 6, 1, 8, m.highlight);
                break;

            case 'greatsword':
                // Handle
                this.rect(ctx, weaponX, weaponY + 10, 2, 8, h.outline);
                this.rect(ctx, weaponX, weaponY + 11, 2, 6, h.base);
                // Guard
                this.rect(ctx, weaponX - 3, weaponY + 8, 8, 2, m.outline);
                this.rect(ctx, weaponX - 2, weaponY + 9, 6, 1, m.base);
                // Blade
                this.rect(ctx, weaponX - 1, weaponY - 16, 4, 24, m.outline);
                this.rect(ctx, weaponX, weaponY - 15, 3, 22, m.shadow);
                this.rect(ctx, weaponX, weaponY - 14, 2, 20, m.base);
                this.rect(ctx, weaponX, weaponY - 12, 1, 16, m.highlight);
                break;

            case 'axe':
                // Handle
                this.rect(ctx, weaponX, weaponY - 6, 2, 18, h.outline);
                this.rect(ctx, weaponX, weaponY - 5, 2, 16, h.base);
                // Head
                this.rect(ctx, weaponX - 4, weaponY - 10, 6, 8, m.outline);
                this.rect(ctx, weaponX - 3, weaponY - 9, 4, 6, m.shadow);
                this.rect(ctx, weaponX - 3, weaponY - 8, 3, 4, m.base);
                break;

            case 'spear':
                // Shaft
                this.rect(ctx, weaponX, weaponY - 18, 2, 30, h.outline);
                this.rect(ctx, weaponX, weaponY - 17, 2, 28, h.base);
                // Head
                this.rect(ctx, weaponX - 1, weaponY - 24, 4, 8, m.outline);
                this.rect(ctx, weaponX, weaponY - 23, 2, 6, m.base);
                this.rect(ctx, weaponX, weaponY - 22, 1, 4, m.highlight);
                break;

            case 'katana':
                // Handle
                this.rect(ctx, weaponX, weaponY + 8, 2, 6, '#1a1512');
                // Guard
                this.rect(ctx, weaponX - 1, weaponY + 6, 4, 2, m.outline);
                // Curved blade
                this.rect(ctx, weaponX, weaponY - 12, 2, 18, m.outline);
                this.rect(ctx, weaponX, weaponY - 11, 2, 16, '#a0a0a0');
                this.rect(ctx, weaponX + 1, weaponY - 10, 1, 14, '#d0d0d0');
                break;

            case 'mace':
                // Handle
                this.rect(ctx, weaponX, weaponY, 2, 12, h.outline);
                this.rect(ctx, weaponX, weaponY + 1, 2, 10, h.base);
                // Head
                this.rect(ctx, weaponX - 2, weaponY - 6, 6, 6, m.outline);
                this.rect(ctx, weaponX - 1, weaponY - 5, 4, 4, m.base);
                // Spikes
                this.setPixel(ctx, weaponX - 3, weaponY - 4, m.base);
                this.setPixel(ctx, weaponX + 4, weaponY - 4, m.base);
                this.setPixel(ctx, weaponX, weaponY - 7, m.base);
                break;

            case 'scythe':
                // Shaft
                this.rect(ctx, weaponX, weaponY - 12, 2, 24, h.outline);
                this.rect(ctx, weaponX, weaponY - 11, 2, 22, h.base);
                // Blade
                this.rect(ctx, weaponX - 8, weaponY - 14, 10, 2, m.outline);
                this.rect(ctx, weaponX - 8, weaponY - 12, 2, 6, m.outline);
                this.rect(ctx, weaponX - 7, weaponY - 13, 8, 1, m.base);
                this.rect(ctx, weaponX - 7, weaponY - 11, 1, 4, m.base);
                break;

            case 'staff':
                // Shaft
                this.rect(ctx, weaponX, weaponY - 14, 2, 26, h.outline);
                this.rect(ctx, weaponX, weaponY - 13, 2, 24, '#5a4030');
                // Crystal
                const curse = PALETTES.effects.curse;
                this.rect(ctx, weaponX - 2, weaponY - 20, 6, 8, curse.shadow);
                this.rect(ctx, weaponX - 1, weaponY - 19, 4, 6, curse.base);
                this.rect(ctx, weaponX, weaponY - 18, 2, 4, curse.highlight);
                break;
        }
    }

    // Draw shield
    drawShield(ctx, type, baseX, baseY) {
        if (type === 'none') return;

        const m = PALETTES.metal.iron;
        const shieldX = baseX - 10;
        const shieldY = baseY + 12;

        switch (type) {
            case 'buckler':
                this.rect(ctx, shieldX - 2, shieldY, 6, 6, m.outline);
                this.rect(ctx, shieldX - 1, shieldY + 1, 4, 4, m.shadow);
                this.rect(ctx, shieldX, shieldY + 2, 2, 2, m.base);
                break;

            case 'kite':
                this.rect(ctx, shieldX - 3, shieldY - 2, 7, 12, m.outline);
                this.rect(ctx, shieldX - 2, shieldY - 1, 5, 10, m.shadow);
                this.rect(ctx, shieldX - 1, shieldY, 3, 7, m.base);
                // Cross
                this.rect(ctx, shieldX, shieldY, 1, 6, PALETTES.fabric.red.base);
                this.rect(ctx, shieldX - 1, shieldY + 2, 3, 1, PALETTES.fabric.red.base);
                break;

            case 'tower':
                this.rect(ctx, shieldX - 4, shieldY - 4, 8, 16, m.outline);
                this.rect(ctx, shieldX - 3, shieldY - 3, 6, 14, m.shadow);
                this.rect(ctx, shieldX - 2, shieldY - 2, 4, 12, m.base);
                break;

            case 'crest':
                const crest = PALETTES.fabric.red;
                this.rect(ctx, shieldX - 3, shieldY - 2, 7, 10, crest.outline);
                this.rect(ctx, shieldX - 2, shieldY - 1, 5, 8, crest.shadow);
                this.rect(ctx, shieldX - 1, shieldY, 3, 6, crest.base);
                // Gold emblem
                this.rect(ctx, shieldX - 1, shieldY + 1, 3, 3, PALETTES.metal.gold.base);
                break;

            case 'skull':
                this.rect(ctx, shieldX - 3, shieldY - 2, 7, 10, m.outline);
                this.rect(ctx, shieldX - 2, shieldY - 1, 5, 8, m.shadow);
                // Skull face
                const bone = '#c8c0b8';
                this.rect(ctx, shieldX - 1, shieldY, 3, 4, bone);
                this.setPixel(ctx, shieldX - 1, shieldY + 1, '#000000');
                this.setPixel(ctx, shieldX + 1, shieldY + 1, '#000000');
                this.rect(ctx, shieldX - 1, shieldY + 3, 3, 1, '#808080');
                break;
        }
    }

    // Draw scars
    drawScars(ctx, type, baseX, baseY) {
        if (type === 'none') return;

        switch (type) {
            case 'face':
                this.setPixel(ctx, baseX + 1, baseY + 2, '#6a3030');
                this.setPixel(ctx, baseX + 1, baseY + 3, '#6a3030');
                this.setPixel(ctx, baseX + 2, baseY + 4, '#6a3030');
                this.setPixel(ctx, baseX + 2, baseY + 5, '#6a3030');
                break;

            case 'burns':
                this.rect(ctx, baseX + 1, baseY + 2, 2, 3, 'rgba(80, 30, 20, 0.6)');
                this.rect(ctx, baseX - 2, baseY + 12, 3, 4, 'rgba(60, 20, 15, 0.5)');
                break;

            case 'decay':
                this.setPixel(ctx, baseX - 2, baseY + 3, 'rgba(40, 30, 20, 0.7)');
                this.setPixel(ctx, baseX - 3, baseY + 4, 'rgba(40, 30, 20, 0.7)');
                this.setPixel(ctx, baseX + 3, baseY + 14, 'rgba(40, 30, 20, 0.6)');
                this.setPixel(ctx, baseX - 4, baseY + 16, 'rgba(40, 30, 20, 0.6)');
                break;

            case 'brand':
                // Darksign-like brand
                this.rect(ctx, baseX + 2, baseY + 10, 3, 3, 'rgba(100, 30, 20, 0.8)');
                this.setPixel(ctx, baseX + 3, baseY + 11, 'rgba(200, 80, 40, 0.9)');
                break;
        }
    }

    // Draw effects
    drawEffects(ctx, type, baseX, baseY, time) {
        if (type === 'none') return;

        const pulse = Math.sin(time / 200) * 0.3 + 0.7;

        switch (type) {
            case 'ember':
                const ember = PALETTES.effects.ember;
                ctx.globalAlpha = pulse;
                this.setPixel(ctx, baseX - 2, baseY + 4, ember.glow);
                this.setPixel(ctx, baseX + 3, baseY + 6, ember.glow);
                this.setPixel(ctx, baseX - 1, baseY + 18, ember.base);
                this.setPixel(ctx, baseX + 2, baseY + 20, ember.base);
                // Eye glow
                this.setPixel(ctx, baseX - 2, baseY + 3, ember.glow);
                this.setPixel(ctx, baseX + 1, baseY + 3, ember.glow);
                ctx.globalAlpha = 1;
                break;

            case 'curse':
                const curse = PALETTES.effects.curse;
                ctx.globalAlpha = pulse * 0.8;
                this.setPixel(ctx, baseX + 2, baseY + 3, curse.glow);
                this.setPixel(ctx, baseX + 3, baseY + 4, curse.base);
                this.setPixel(ctx, baseX + 2, baseY + 5, curse.glow);
                this.rect(ctx, baseX - 3, baseY + 14, 2, 2, curse.base);
                ctx.globalAlpha = 1;
                break;

            case 'blood':
                const blood = PALETTES.effects.blood;
                this.setPixel(ctx, baseX - 2, baseY + 5, blood.base);
                this.setPixel(ctx, baseX - 2, baseY + 6, blood.base);
                this.setPixel(ctx, baseX - 3, baseY + 7, blood.shadow);
                this.setPixel(ctx, baseX + 3, baseY + 16, blood.base);
                this.setPixel(ctx, baseX + 3, baseY + 17, blood.shadow);
                break;

            case 'souls':
                ctx.globalAlpha = pulse * 0.6;
                // Floating soul particles
                const soulY = (time / 50) % 10;
                this.setPixel(ctx, baseX - 4, baseY + 8 - soulY / 2, '#a0e0ff');
                this.setPixel(ctx, baseX + 5, baseY + 12 - soulY / 3, '#80c0e0');
                this.setPixel(ctx, baseX, baseY + 6 - soulY / 4, '#c0f0ff');
                ctx.globalAlpha = 1;
                break;
        }
    }
}

// Create global instance
const spriteRenderer = new SpriteRenderer();
