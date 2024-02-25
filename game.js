var config = {
    // налаштування вигляду гри
    type: Phaser.AUTO,
    width: 1000,
    height: 1000,
    // фізика гри
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);


function preload() {
    // передзавантаження хмар, землі, зірочок та бомб, налаштування виду гравця
    this.load.image('bg', 'assets/background.png');
    this.load.image('ground', 'assets/new floor 1.png');
    this.load.image('trophy', 'assets/trophy.png');
    /*
    this.load.spritesheet('dude',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
    */
}

var platforms;

function create() {
    // тло
    this.add.image(1000, 1000, 'bg');

    platforms = this.physics.add.staticGroup();

    // земля
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    //платформи
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');


    // зірочки
    stars = this.physics.add.group({
        key: 'trophy',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    // коллайдер зірочок та платформ
    this.physics.add.collider(stars, platforms);
}

function update() {
    /* // саме управління
    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    } */
}
