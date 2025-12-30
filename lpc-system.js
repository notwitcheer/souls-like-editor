// ========================================
// HOLLOW FORGE - LPC PNG Layering System
// High-quality sprite composition with real PNG assets
// ========================================

class LPCAssetLoader {
    constructor() {
        this.assets = new Map();
        this.loadQueue = [];
        this.loadingPromises = new Map();
        this.isLoading = false;
    }

    // Load and cache PNG asset
    async loadAsset(path, id) {
        if (this.assets.has(id)) {
            return this.assets.get(id);
        }

        if (this.loadingPromises.has(id)) {
            return this.loadingPromises.get(id);
        }

        const promise = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.assets.set(id, img);
                this.loadingPromises.delete(id);
                resolve(img);
            };
            img.onerror = () => {
                this.loadingPromises.delete(id);
                reject(new Error(`Failed to load asset: ${path}`));
            };
            img.src = path;
        });

        this.loadingPromises.set(id, promise);
        return promise;
    }

    // Preload multiple assets
    async preloadAssets(assetList) {
        const promises = assetList.map(({ path, id }) =>
            this.loadAsset(path, id).catch(err => {
                console.warn(`Asset load failed: ${id}`, err);
                return null;
            })
        );
        await Promise.all(promises);
    }

    getAsset(id) {
        return this.assets.get(id) || null;
    }

    // Clear cache
    clearCache() {
        this.assets.clear();
        this.loadingPromises.clear();
    }
}

class LPCCharacterRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        this.assetLoader = new LPCAssetLoader();

        // LPC sprite dimensions
        this.frameWidth = 64;
        this.frameHeight = 64;
        this.sheetCols = 13;  // Standard LPC sheet columns
        this.sheetRows = 21;  // Standard LPC sheet rows

        // Animation settings
        this.currentAnimation = 'idle';
        this.currentDirection = 'down'; // down, left, right, up
        this.animationFrame = 0;
        this.animationSpeed = 8; // frames per animation frame
        this.frameCounter = 0;

        // Layer order (back to front)
        this.layerOrder = [
            'body',
            'eyes',
            'nose',
            'ears',
            'hair',
            'facial_hair',
            'feet',
            'legs',
            'torso',
            'belt',
            'arms',
            'hands',
            'head',
            'hat',
            'behind_body',
            'behind',
            'weapon'
        ];

        // Animation mappings
        this.animations = {
            idle: { row: 10, frames: 1, speed: 60 },
            walk: { row: 8, frames: 9, speed: 8 },
            run: { row: 9, frames: 6, speed: 6 },
            slash: { row: 6, frames: 6, speed: 4 },
            thrust: { row: 4, frames: 8, speed: 4 },
            cast: { row: 0, frames: 7, speed: 6 },
            shoot: { row: 12, frames: 13, speed: 4 },
            hurt: { row: 20, frames: 6, speed: 8 }
        };

        this.directionMap = {
            up: 0,
            left: 1,
            down: 2,
            right: 3
        };
    }

    // Calculate frame position in spritesheet
    getFrameRect(animation, direction, frameIndex) {
        const animData = this.animations[animation];
        if (!animData) return null;

        const directionIndex = this.directionMap[direction];
        const row = animData.row + directionIndex;
        const col = frameIndex;

        return {
            x: col * this.frameWidth,
            y: row * this.frameHeight,
            width: this.frameWidth,
            height: this.frameHeight
        };
    }

    // Update animation frame
    updateAnimation() {
        this.frameCounter++;
        const animData = this.animations[this.currentAnimation];
        if (!animData) return;

        if (this.frameCounter >= animData.speed) {
            this.animationFrame = (this.animationFrame + 1) % animData.frames;
            this.frameCounter = 0;
        }
    }

    // Set character animation
    setAnimation(animation, direction = null) {
        if (animation !== this.currentAnimation) {
            this.currentAnimation = animation;
            this.animationFrame = 0;
            this.frameCounter = 0;
        }
        if (direction) {
            this.currentDirection = direction;
        }
    }

    // Render single sprite layer
    drawSpriteLayer(spriteSheet, targetX, targetY, scale = 1) {
        if (!spriteSheet) return;

        const frameRect = this.getFrameRect(
            this.currentAnimation,
            this.currentDirection,
            this.animationFrame
        );

        if (!frameRect) return;

        const drawWidth = this.frameWidth * scale;
        const drawHeight = this.frameHeight * scale;

        this.ctx.drawImage(
            spriteSheet,
            frameRect.x, frameRect.y, frameRect.width, frameRect.height,
            targetX, targetY, drawWidth, drawHeight
        );
    }

    // Render complete character
    async renderCharacter(characterConfig, x, y, scale = 2) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update animation
        this.updateAnimation();

        // Draw background if specified
        if (characterConfig.background) {
            await this.drawBackground(characterConfig.background);
        }

        // Draw character layers in order
        for (const layerName of this.layerOrder) {
            const assetId = characterConfig[layerName];
            if (assetId && assetId !== 'none') {
                const spriteSheet = this.assetLoader.getAsset(assetId);
                if (spriteSheet) {
                    this.drawSpriteLayer(spriteSheet, x, y, scale);
                }
            }
        }

        // Draw effects on top
        if (characterConfig.effects) {
            await this.drawEffects(characterConfig.effects, x, y, scale);
        }
    }

    // Draw background
    async drawBackground(backgroundId) {
        const bgAsset = this.assetLoader.getAsset(backgroundId);
        if (bgAsset) {
            this.ctx.drawImage(bgAsset, 0, 0, this.canvas.width, this.canvas.height);
        }
    }

    // Draw particle effects
    async drawEffects(effects, x, y, scale) {
        // Implementation for auras, particles, etc.
        // This will use the existing aura system but with better assets
    }

    // Preload character assets
    async preloadCharacterAssets(characterConfig) {
        const assetIds = [];

        // Collect all asset IDs from config
        for (const layerName of this.layerOrder) {
            const assetId = characterConfig[layerName];
            if (assetId && assetId !== 'none') {
                assetIds.push(assetId);
            }
        }

        // Add background and effects
        if (characterConfig.background) assetIds.push(characterConfig.background);
        if (characterConfig.effects) assetIds.push(...characterConfig.effects);

        // Load assets
        const assetList = assetIds.map(id => ({
            id,
            path: `assets/sprites/${id}.png`
        }));

        await this.assetLoader.preloadAssets(assetList);
    }
}

// Enhanced Asset Configuration
const LPC_ASSETS = {
    // Body types with skin variations
    body: [
        { id: 'male_light', name: 'Human Male (Light)', path: 'body/male_light.png' },
        { id: 'male_dark', name: 'Human Male (Dark)', path: 'body/male_dark.png' },
        { id: 'female_light', name: 'Human Female (Light)', path: 'body/female_light.png' },
        { id: 'female_dark', name: 'Human Female (Dark)', path: 'body/female_dark.png' },
        { id: 'skeleton', name: 'Skeleton', path: 'body/skeleton.png' },
        { id: 'zombie', name: 'Zombie', path: 'body/zombie.png' },
        { id: 'orc', name: 'Orc', path: 'body/orc.png' }
    ],

    // Hair styles
    hair: [
        { id: 'none', name: 'None' },
        { id: 'plain', name: 'Plain', path: 'hair/plain.png' },
        { id: 'ponytail', name: 'Ponytail', path: 'hair/ponytail.png' },
        { id: 'messy', name: 'Messy', path: 'hair/messy.png' },
        { id: 'long', name: 'Long', path: 'hair/long.png' },
        { id: 'braided', name: 'Braided', path: 'hair/braided.png' }
    ],

    // Armor pieces
    torso: [
        { id: 'none', name: 'None' },
        { id: 'leather_vest', name: 'Leather Vest', path: 'torso/leather_vest.png' },
        { id: 'chain_mail', name: 'Chain Mail', path: 'torso/chain_mail.png' },
        { id: 'plate_armor', name: 'Plate Armor', path: 'torso/plate_armor.png' },
        { id: 'dark_armor', name: 'Dark Armor', path: 'torso/dark_armor.png' },
        { id: 'robe', name: 'Robe', path: 'torso/robe.png' },
        { id: 'noble_shirt', name: 'Noble Shirt', path: 'torso/noble_shirt.png' }
    ],

    // Legs armor
    legs: [
        { id: 'none', name: 'None' },
        { id: 'pants', name: 'Pants', path: 'legs/pants.png' },
        { id: 'leather_pants', name: 'Leather Pants', path: 'legs/leather_pants.png' },
        { id: 'chain_legs', name: 'Chain Legs', path: 'legs/chain_legs.png' },
        { id: 'plate_legs', name: 'Plate Legs', path: 'legs/plate_legs.png' },
        { id: 'dark_legs', name: 'Dark Legs', path: 'legs/dark_legs.png' }
    ],

    // Weapons
    weapon: [
        { id: 'none', name: 'None' },
        { id: 'dagger', name: 'Dagger', path: 'weapons/dagger.png' },
        { id: 'sword', name: 'Sword', path: 'weapons/sword.png' },
        { id: 'great_sword', name: 'Great Sword', path: 'weapons/great_sword.png' },
        { id: 'mace', name: 'Mace', path: 'weapons/mace.png' },
        { id: 'staff', name: 'Staff', path: 'weapons/staff.png' },
        { id: 'bow', name: 'Bow', path: 'weapons/bow.png' },
        { id: 'dark_sword', name: 'Cursed Blade', path: 'weapons/dark_sword.png' }
    ],

    // Head gear
    head: [
        { id: 'none', name: 'None' },
        { id: 'leather_cap', name: 'Leather Cap', path: 'head/leather_cap.png' },
        { id: 'chain_coif', name: 'Chain Coif', path: 'head/chain_coif.png' },
        { id: 'helm', name: 'Helm', path: 'head/helm.png' },
        { id: 'crown', name: 'Crown', path: 'head/crown.png' },
        { id: 'hood', name: 'Hood', path: 'head/hood.png' },
        { id: 'skull_helm', name: 'Skull Helm', path: 'head/skull_helm.png' }
    ],

    // Backgrounds
    background: [
        { id: 'castle', name: 'Castle Hall', path: 'backgrounds/castle.png' },
        { id: 'dungeon', name: 'Dungeon', path: 'backgrounds/dungeon.png' },
        { id: 'forest', name: 'Dark Forest', path: 'backgrounds/forest.png' },
        { id: 'throne', name: 'Throne Room', path: 'backgrounds/throne.png' },
        { id: 'graveyard', name: 'Graveyard', path: 'backgrounds/graveyard.png' }
    ]
};

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LPCAssetLoader, LPCCharacterRenderer, LPC_ASSETS };
} else {
    window.LPCAssetLoader = LPCAssetLoader;
    window.LPCCharacterRenderer = LPCCharacterRenderer;
    window.LPC_ASSETS = LPC_ASSETS;
}