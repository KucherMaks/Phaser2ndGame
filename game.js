var config = {
    // налаштування вигляду гри
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: game,
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
var worldWidth = config.width*6;

function preload() {
    // передзавантаження хмар, землі, зірочок та бомб, налаштування виду гравця
    this.load.image('bg', 'assets/fon+.png');
    this.load.image('ground', 'assets/platform3.png');
    this.load.image('ground+', 'assets/new floor 1.png')
    this.load.image('ground++', 'assets/floor 1+.png')
    this.load.image('trophy', 'assets/trophy.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('dirt', 'assets/dirt-wall.png')
    this.load.image('bush', 'assets/bush.png')
    this.load.image('crate', 'assets/crate.png')
    this.load.spritesheet('dude',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

var platforms;

function create() {
    // тло
    // this.add.image(0, 0, 'bg').setOrigin(0,0);

    platforms = this.physics.add.staticGroup();

    // тло на всю ширину екрану
    this.add.tileSprite(0, 0, worldWidth, 1080, "bg").setOrigin(0, 0).setDepth(0);

    // Земля на всю ширину екрану
    for (var x = 0; x < worldWidth; x = x + 100) {
        console.log(x);
        platforms.create(x, 1080 - 400, 'ground++').setScale(0.2).setOrigin(0, 0).refreshBody();
    }

    // Земля під землею
    for (var x = 0; x < worldWidth; x = x + 50) {
        console.log(x);
        platforms.create(x, 1080 - 352, 'dirt').setScale(0.1).setOrigin(0, 0).refreshBody();
        platforms.create(x, 1080 - 302, 'dirt').setScale(0.1).setOrigin(0, 0).refreshBody();
        platforms.create(x, 1080 - 252, 'dirt').setScale(0.1).setOrigin(0, 0).refreshBody();
        platforms.create(x, 1080 - 202, 'dirt').setScale(0.1).setOrigin(0, 0).refreshBody();
        platforms.create(x, 1080 - 152, 'dirt').setScale(0.1).setOrigin(0, 0).refreshBody();
    }

    // Додавання платформ випадковим чином на всю ширину екрану
    for (var x = 0; x < worldWidth; x = x + Phaser.Math.FloatBetween(400, 500)) {
        var y = Phaser.Math.FloatBetween(400, 600);
        console.log(x, y);
        platforms.create(x, y, 'ground');
    }

    box = this.physics.add.staticGroup();

    // Додавання ящиків випадковим чином на всю ширину екрану
    for (var x = 0; x < worldWidth; x = x + Phaser.Math.FloatBetween(200, 400)) {
        var y = 680;
        console.log(x, y);
        box.create(x, y, 'crate').setScale(Phaser.Math.FloatBetween(0.3, 0.6)).setOrigin(0, 1).setDepth(Phaser.Math.FloatBetween(0, 10)).refreshBody();
    }

    // про гравця
    player = this.physics.add.sprite(100, 450, 'dude').setDepth(5);
    player.setBounce(0.2);
    player.setCollideWorldBounds(false);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // коллайдер гравця та платформ
    this.physics.add.collider(player, platforms);

    //  задання управління
    cursors = this.input.keyboard.createCursorKeys();

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

    //  стикання колайдера гравця з колайдером зірочок
    this.physics.add.overlap(player, stars, collectStar, null, this);

    //  рахунок
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    // бомбочки
    bombs = this.physics.add.group();

    // коллайдер бомбочок і платформ
    this.physics.add.collider(bombs, platforms);

    // коллайдер гравця і бомбочок
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    // Налаштування камери
    this.cameras.main.setBounds(0, 0, worldWidth, 1080);
    this.physics.world.setBounds(0, 0, worldWidth, 1080);

    // Слідкування камери за гравцем
    this.cameras.main.startFollow(player);
}

function update() {
    // саме управління
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
    }
}

//функція збір зірочок
function collectStar(player, star) {
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('score: ' + score);

    var x = Phaser.Math.Between(0, config.width);
    var y = Phaser.Math.Between(0, 680);
    var bomb = bombs.create(x, y, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        
    }
}

// змінні для рахунку
var score = 0;
var scoreText;

// опис бомбочок
function hitBomb(player, bomb) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}