// ========================================
// HOLLOW FORGE - LPC Enhanced Version
// Character Creator with PNG-based assets
// ========================================

class HollowForgeLPC {
    constructor() {
        // Get canvas and set size
        this.canvas = document.getElementById('gameCanvas');
        this.canvas.width = 192; // Larger for better LPC display
        this.canvas.height = 256;

        // Initialize LPC renderer
        this.lpcRenderer = new LPCCharacterRenderer(this.canvas);

        // Character state using LPC asset IDs
        this.character = {
            body: 'male_light',
            hair: 'plain',
            head: 'none',
            torso: 'leather_vest',
            legs: 'pants',
            weapon: 'sword',
            background: 'castle',
            effects: []
        };

        // Animation state
        this.currentAnimation = 'idle';
        this.currentDirection = 'down';
        this.isAnimating = false;

        // Initialize
        this.setupTabs();
        this.setupOptions();
        this.setupButtons();
        this.startAnimation();
        this.updateBadge();
        this.preloadInitialAssets();
    }

    // =====================================
    // INITIALIZATION
    // =====================================

    async preloadInitialAssets() {
        // Preload the current character configuration
        try {
            await this.lpcRenderer.preloadCharacterAssets(this.character);
            console.log('Initial assets loaded successfully');
        } catch (error) {
            console.warn('Some assets failed to load:', error);
        }
    }

    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;

                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));

                btn.classList.add('active');
                document.querySelector(`[data-panel="${tabId}"]`).classList.add('active');
            });
        });
    }

    setupOptions() {
        const mappings = [
            { gridId: 'bodyGrid', assets: LPC_ASSETS.body, prop: 'body' },
            { gridId: 'hairGrid', assets: LPC_ASSETS.hair, prop: 'hair' },
            { gridId: 'helmetGrid', assets: LPC_ASSETS.head, prop: 'head' },
            { gridId: 'chestGrid', assets: LPC_ASSETS.torso, prop: 'torso' },
            { gridId: 'legsGrid', assets: LPC_ASSETS.legs, prop: 'legs' },
            { gridId: 'weaponGrid', assets: LPC_ASSETS.weapon, prop: 'weapon' },
            { gridId: 'bgGrid', assets: LPC_ASSETS.background, prop: 'background' }
        ];

        mappings.forEach(({ gridId, assets, prop }) => {
            this.createOptionGrid(gridId, assets, prop);
        });
    }

    createOptionGrid(gridId, assets, prop) {
        const grid = document.getElementById(gridId);
        if (!grid) return;

        assets.forEach(asset => {
            const card = document.createElement('div');
            card.className = 'option-card' + (asset.id === 'none' ? ' none-card' : '');
            card.dataset.id = asset.id;

            if (this.character[prop] === asset.id) {
                card.classList.add('selected');
            }

            // Create thumbnail for non-none options
            if (asset.id !== 'none' && asset.path) {
                const thumbCanvas = document.createElement('canvas');
                thumbCanvas.width = 40;
                thumbCanvas.height = 40;
                this.createThumbnail(thumbCanvas, asset.path);
                card.appendChild(thumbCanvas);
            }

            const label = document.createElement('span');
            label.className = 'option-name';
            label.textContent = asset.name;
            card.appendChild(label);

            card.addEventListener('click', () => {
                this.selectOption(prop, asset.id, grid);
            });

            grid.appendChild(card);
        });
    }

    createThumbnail(canvas, assetPath) {
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Load and draw thumbnail
        const img = new Image();
        img.onload = () => {
            // Draw a single frame from the sprite sheet as thumbnail
            const frameWidth = 64;
            const frameHeight = 64;
            const scale = 0.625; // 40/64

            // Draw the idle frame (usually at row 10, col 0 for down direction)
            ctx.drawImage(
                img,
                0, 10 * frameHeight, frameWidth, frameHeight, // Source
                0, 0, canvas.width, canvas.height // Destination
            );
        };
        img.onerror = () => {
            // Fallback: draw a simple rectangle
            ctx.fillStyle = '#444';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#888';
            ctx.fillRect(2, 2, canvas.width - 4, canvas.height - 4);
        };
        img.src = `assets/sprites/${assetPath}`;
    }

    async selectOption(prop, id, grid) {
        // Trigger animation when changing options
        this.triggerChangeAnimation();

        this.character[prop] = id;

        grid.querySelectorAll('.option-card').forEach(card => {
            card.classList.toggle('selected', card.dataset.id === id);
        });

        // Preload new asset if needed
        if (id !== 'none') {
            try {
                await this.lpcRenderer.assetLoader.loadAsset(
                    `assets/sprites/${this.getAssetPath(prop, id)}`,
                    id
                );
            } catch (error) {
                console.warn(`Failed to load asset ${id}:`, error);
            }
        }

        this.updateBadge();
    }

    getAssetPath(prop, id) {
        const assetList = LPC_ASSETS[prop === 'head' ? 'head' :
                                      prop === 'background' ? 'background' :
                                      prop === 'body' ? 'body' :
                                      prop === 'hair' ? 'hair' :
                                      prop === 'torso' ? 'torso' :
                                      prop === 'legs' ? 'legs' :
                                      prop === 'weapon' ? 'weapon' : 'body'];

        const asset = assetList.find(a => a.id === id);
        return asset ? asset.path : `${prop}/${id}.png`;
    }

    triggerChangeAnimation() {
        // Quick animation when changing equipment
        const prevAnim = this.currentAnimation;
        this.currentAnimation = 'hurt';
        this.lpcRenderer.setAnimation('hurt');

        setTimeout(() => {
            this.currentAnimation = prevAnim;
            this.lpcRenderer.setAnimation(prevAnim);
        }, 300);
    }

    updateBadge() {
        const badge = document.getElementById('classBadge');
        const torsoType = this.character.torso;

        const classes = {
            'none': 'DEPRIVED',
            'leather_vest': 'WANDERER',
            'chain_mail': 'WARRIOR',
            'plate_armor': 'KNIGHT',
            'dark_armor': 'DARKWRAITH',
            'robe': 'SORCERER',
            'noble_shirt': 'NOBLE'
        };

        badge.textContent = classes[torsoType] || 'UNDEAD';
    }

    setupButtons() {
        document.getElementById('randomizeBtn').addEventListener('click', () => this.randomize());
        document.getElementById('downloadBtn').addEventListener('click', () => this.download());
        document.getElementById('copyBtn').addEventListener('click', () => this.copy());
        document.getElementById('beginBtn').addEventListener('click', () => this.showToast('Your legend begins...'));

        // Add animation controls
        this.setupAnimationControls();
    }

    setupAnimationControls() {
        // Add hover effects for interactivity
        this.canvas.addEventListener('mouseenter', () => {
            if (!this.isAnimating) {
                this.lpcRenderer.setAnimation('walk');
                this.isAnimating = true;
            }
        });

        this.canvas.addEventListener('mouseleave', () => {
            if (this.isAnimating) {
                this.lpcRenderer.setAnimation('idle');
                this.isAnimating = false;
            }
        });

        this.canvas.addEventListener('click', () => {
            // Cycle through animations on click
            const animations = ['idle', 'walk', 'slash', 'cast', 'thrust'];
            const current = animations.indexOf(this.currentAnimation);
            const next = (current + 1) % animations.length;
            this.currentAnimation = animations[next];
            this.lpcRenderer.setAnimation(this.currentAnimation);
        });
    }

    async randomize() {
        const pick = arr => arr[Math.floor(Math.random() * arr.length)];

        // Store previous character for comparison
        const prevChar = { ...this.character };

        this.character = {
            body: pick(LPC_ASSETS.body).id,
            hair: pick(LPC_ASSETS.hair).id,
            head: pick(LPC_ASSETS.head).id,
            torso: pick(LPC_ASSETS.torso).id,
            legs: pick(LPC_ASSETS.legs).id,
            weapon: pick(LPC_ASSETS.weapon).id,
            background: pick(LPC_ASSETS.background).id,
            effects: []
        };

        // Update all option grids
        document.querySelectorAll('.option-grid').forEach(grid => {
            const prop = this.getGridProp(grid.id);
            if (prop && this.character[prop] !== undefined) {
                grid.querySelectorAll('.option-card').forEach(card => {
                    card.classList.toggle('selected', card.dataset.id === this.character[prop]);
                });
            }
        });

        // Preload new assets
        try {
            await this.lpcRenderer.preloadCharacterAssets(this.character);
        } catch (error) {
            console.warn('Some randomized assets failed to load:', error);
        }

        this.updateBadge();
        this.showToast('Character randomized!');

        // Play randomization animation
        this.lpcRenderer.setAnimation('hurt');
        setTimeout(() => this.lpcRenderer.setAnimation('idle'), 500);
    }

    getGridProp(gridId) {
        const map = {
            bodyGrid: 'body',
            hairGrid: 'hair',
            helmetGrid: 'head',
            chestGrid: 'torso',
            legsGrid: 'legs',
            weaponGrid: 'weapon',
            bgGrid: 'background'
        };
        return map[gridId];
    }

    // =====================================
    // RENDERING
    // =====================================

    startAnimation() {
        const animate = (timestamp) => {
            // Calculate character position (center of canvas)
            const x = (this.canvas.width - 64 * 2) / 2;
            const y = (this.canvas.height - 64 * 2) / 2;

            // Render character with LPC system
            this.lpcRenderer.renderCharacter(this.character, x, y, 2);

            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    // =====================================
    // EXPORT
    // =====================================

    download() {
        // Create high-res export
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = this.canvas.width * 2;
        exportCanvas.height = this.canvas.height * 2;
        const exportCtx = exportCanvas.getContext('2d');
        exportCtx.imageSmoothingEnabled = false;

        // Draw current canvas scaled up
        exportCtx.drawImage(this.canvas, 0, 0, exportCanvas.width, exportCanvas.height);

        const link = document.createElement('a');
        link.download = 'hollow_forge_character.png';
        link.href = exportCanvas.toDataURL('image/png');
        link.click();

        this.showToast('High-resolution image saved!');
    }

    async copy() {
        try {
            // Create export canvas
            const exportCanvas = document.createElement('canvas');
            exportCanvas.width = this.canvas.width * 2;
            exportCanvas.height = this.canvas.height * 2;
            const exportCtx = exportCanvas.getContext('2d');
            exportCtx.imageSmoothingEnabled = false;
            exportCtx.drawImage(this.canvas, 0, 0, exportCanvas.width, exportCanvas.height);

            const blob = await new Promise(resolve =>
                exportCanvas.toBlob(resolve, 'image/png'));
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            this.showToast('Copied to clipboard!');
        } catch (e) {
            this.showToast('Copy failed - downloading instead...');
            this.download();
        }
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
    }

    // =====================================
    // ASSET MANAGEMENT
    // =====================================

    async switchToLPCMode() {
        // Clear any existing rendering
        this.lpcRenderer.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Show loading message
        this.showToast('Loading LPC assets...');

        try {
            // Preload essential assets
            await this.lpcRenderer.preloadCharacterAssets(this.character);

            // Start LPC rendering
            this.startAnimation();

            this.showToast('LPC mode activated!');
        } catch (error) {
            console.error('Failed to switch to LPC mode:', error);
            this.showToast('Failed to load some assets');
        }
    }
}

// Initialize LPC version when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if LPC assets are available
    if (typeof LPCCharacterRenderer !== 'undefined') {
        window.app = new HollowForgeLPC();
    } else {
        console.error('LPC system not loaded. Include lpc-system.js first.');
    }
});