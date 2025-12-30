// ========================================
// Test Asset Generator for LPC System
// Generates placeholder PNG spritesheets
// ========================================

class TestAssetGenerator {
    constructor() {
        this.frameWidth = 64;
        this.frameHeight = 64;
        this.sheetCols = 13;
        this.sheetRows = 21;
    }

    // Create a basic test spritesheet
    createTestSpriteSheet(color = '#888888', name = 'test') {
        const canvas = document.createElement('canvas');
        canvas.width = this.frameWidth * this.sheetCols;
        canvas.height = this.frameHeight * this.sheetRows;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;

        // Clear to transparent
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw test frames for key animations
        const animations = [
            { name: 'cast', row: 0, frames: 7 },
            { name: 'thrust', row: 4, frames: 8 },
            { name: 'slash', row: 6, frames: 6 },
            { name: 'walk', row: 8, frames: 9 },
            { name: 'run', row: 9, frames: 6 },
            { name: 'idle', row: 10, frames: 1 },
            { name: 'shoot', row: 12, frames: 13 },
            { name: 'hurt', row: 20, frames: 6 }
        ];

        // Draw each animation
        animations.forEach(anim => {
            for (let dir = 0; dir < 4; dir++) { // 4 directions
                const row = anim.row + dir;
                for (let frame = 0; frame < anim.frames; frame++) {
                    this.drawTestFrame(ctx, frame, row, color, name);
                }
            }
        });

        return canvas;
    }

    drawTestFrame(ctx, col, row, color, type) {
        const x = col * this.frameWidth;
        const y = row * this.frameHeight;
        const centerX = x + this.frameWidth / 2;
        const centerY = y + this.frameHeight / 2;

        // Draw based on sprite type
        switch (type) {
            case 'body':
                this.drawBody(ctx, centerX, centerY, color);
                break;
            case 'hair':
                this.drawHair(ctx, centerX, centerY, color);
                break;
            case 'armor':
                this.drawArmor(ctx, centerX, centerY, color);
                break;
            case 'weapon':
                this.drawWeapon(ctx, centerX, centerY, color);
                break;
            default:
                this.drawGeneric(ctx, centerX, centerY, color);
        }
    }

    drawBody(ctx, centerX, centerY, skinColor) {
        // Head
        ctx.fillStyle = skinColor;
        ctx.fillRect(centerX - 6, centerY - 20, 12, 12);

        // Eyes
        ctx.fillStyle = '#000000';
        ctx.fillRect(centerX - 4, centerY - 18, 2, 2);
        ctx.fillRect(centerX + 2, centerY - 18, 2, 2);

        // Body
        ctx.fillStyle = skinColor;
        ctx.fillRect(centerX - 4, centerY - 6, 8, 12);

        // Arms
        ctx.fillRect(centerX - 8, centerY - 4, 4, 10);
        ctx.fillRect(centerX + 4, centerY - 4, 4, 10);

        // Legs
        ctx.fillRect(centerX - 4, centerY + 6, 3, 12);
        ctx.fillRect(centerX + 1, centerY + 6, 3, 12);
    }

    drawHair(ctx, centerX, centerY, hairColor) {
        ctx.fillStyle = hairColor;
        // Simple hair shape on top of head
        ctx.fillRect(centerX - 8, centerY - 24, 16, 8);
        ctx.fillRect(centerX - 6, centerY - 26, 12, 4);
    }

    drawArmor(ctx, centerX, centerY, armorColor) {
        ctx.fillStyle = armorColor;
        // Chest piece
        ctx.fillRect(centerX - 6, centerY - 6, 12, 14);
        // Shoulder guards
        ctx.fillRect(centerX - 10, centerY - 6, 4, 6);
        ctx.fillRect(centerX + 6, centerY - 6, 4, 6);
    }

    drawWeapon(ctx, centerX, centerY, weaponColor) {
        ctx.fillStyle = weaponColor;
        // Simple sword
        ctx.fillRect(centerX + 8, centerY - 16, 2, 20);
        ctx.fillStyle = '#8B4513'; // Brown handle
        ctx.fillRect(centerX + 7, centerY + 2, 4, 6);
    }

    drawGeneric(ctx, centerX, centerY, color) {
        ctx.fillStyle = color;
        ctx.fillRect(centerX - 4, centerY - 4, 8, 8);
    }

    // Generate and download asset
    generateAsset(type, color, name) {
        const canvas = this.createTestSpriteSheet(color, type);
        const link = document.createElement('a');
        link.download = `${name}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
}

// Asset generation presets
const TEST_ASSETS = {
    body: [
        { name: 'male_light', color: '#FDBCB4' },
        { name: 'male_dark', color: '#8D5524' },
        { name: 'female_light', color: '#FDBCB4' },
        { name: 'skeleton', color: '#E8E8E8' },
        { name: 'zombie', color: '#90A959' },
        { name: 'orc', color: '#739F3D' }
    ],
    hair: [
        { name: 'plain', color: '#8B4513' },
        { name: 'long', color: '#654321' },
        { name: 'messy', color: '#8B4513' },
        { name: 'braided', color: '#654321' }
    ],
    armor: [
        { name: 'leather_vest', color: '#8B4513' },
        { name: 'chain_mail', color: '#C0C0C0' },
        { name: 'plate_armor', color: '#A8A8A8' },
        { name: 'dark_armor', color: '#2F2F2F' },
        { name: 'robe', color: '#4B0082' }
    ],
    weapon: [
        { name: 'sword', color: '#C0C0C0' },
        { name: 'great_sword', color: '#A8A8A8' },
        { name: 'dagger', color: '#C0C0C0' },
        { name: 'staff', color: '#8B4513' },
        { name: 'dark_sword', color: '#2F2F2F' }
    ]
};

// Initialize generator when page loads
document.addEventListener('DOMContentLoaded', () => {
    const generator = new TestAssetGenerator();

    // Add generation button to page
    const button = document.createElement('button');
    button.textContent = 'Generate Test Assets';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '10000';
    button.style.padding = '10px';
    button.style.background = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';

    button.onclick = () => {
        Object.entries(TEST_ASSETS).forEach(([category, assets]) => {
            assets.forEach(asset => {
                setTimeout(() => {
                    generator.generateAsset(category, asset.color, asset.name);
                }, Math.random() * 1000); // Stagger downloads
            });
        });
    };

    document.body.appendChild(button);
    window.testGenerator = generator;
});