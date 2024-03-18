var config = {
    // налаштування вигляду гри
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: game,
    playerSpeed: 500,
    // фізика гри
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
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
var worldWidth = config.width * 6;
var life = 5;
var platforms;
var score = 0;
var scoreText;
var lifeText;

var bullets;


function preload() {
    // передзавантаження хмар, землі, зірочок та бомб, налаштування виду гравця
    // фон
    this.load.image('bg', 'assets/fon+.png');

    // платформа літаюча
    this.load.image('ground', 'assets/platform3.png');
    this.load.image('skyGround', 'assets/14.png')
    this.load.image('skyGroundStart', 'assets/13.png')
    this.load.image('skyGroundEnd', 'assets/15.png')

    // земля
    this.load.image('ground++', 'assets/2.png')

    // трофей
    this.load.image('trophy', 'assets/trophy.png');

    // бомба
    this.load.image('bomb', 'assets/bomb.png');

    // земля під землею
    this.load.image('dirt', 'assets/dirt-wall.png')

    // додаткові об'єкти
    this.load.image('bush', 'assets/bush.png')
    this.load.image('crate', 'assets/Crate.png')
    this.load.image('rock', 'assets/Stone.png')
    this.load.image('heartss', 'assets/heart.png')

    this.load.image('bullett', 'assets/bullet.png')

    // гравець
    this.load.spritesheet('dude',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

function create() {
    // тло на всю ширину екрану
    this.add.tileSprite(0, 0, worldWidth, 1080, "bg")
        .setOrigin(0, 0)
        .setScale(1)
        .setDepth(0);

    platforms = this.physics.add.staticGroup();

    // Земля на всю ширину екрану
    for (var x = 0; x < worldWidth; x = x + 100) {
        platforms.create(x, 1080 - 128, 'ground++')
            .setScale(1)
            .setOrigin(0, 0)
            .setBounce(1)
            .refreshBody();
    }

    // платформи на всю ширину екрану
    for (var x = 0; x < worldWidth; x = x + Phaser.Math.Between(400, 500)) {
        var y = Phaser.Math.Between(300, 900)

        platforms.create(x, y, 'skyGroundStart');

        var i;
        for (i = 1; i < Phaser.Math.Between(0, 5); i++) {
            platforms.create(x + 128 * i, y, 'skyGround').setScale;
        }

        platforms.create(x + 128 * i, y, 'skyGroundEnd');
    }

    box = this.physics.add.staticGroup();
    // Додавання ящиків випадковим чином на всю ширину екрану
    for (var x = 0; x < worldWidth; x = x + Phaser.Math.FloatBetween(500, 1500)) {
        var y = 952;
        box.create(x, y, 'crate')
            .setScale(Phaser.Math.FloatBetween(0.3, 0.6))
            .setOrigin(0, 1)
            .setDepth(Phaser.Math.FloatBetween(0, 10))
            .refreshBody();
    }

    bush = this.physics.add.staticGroup();
    // Додавання кущів випадковим чином на всю ширину екрану
    for (var x = 0; x < worldWidth; x = x + Phaser.Math.FloatBetween(300, 500)) {
        var y = 952;
        bush.create(x, y, 'bush')
            .setScale(Phaser.Math.FloatBetween(0.7, 1.2))
            .setOrigin(0, 1).setDepth(Phaser.Math.FloatBetween(0, 10))
            .refreshBody();
    }

    rock = this.physics.add.staticGroup();
    // Додавання каменів випадковим чином на всю ширину екрану
    for (var x = 0; x < worldWidth; x = x + Phaser.Math.FloatBetween(300, 700)) {
        var y = 952;
        rock.create(x, y, 'rock')
            .setScale(Phaser.Math.FloatBetween(0.6, 1.1))
            .setOrigin(0, 1)
            .setDepth(Phaser.Math.FloatBetween(0, 10))
            .refreshBody();
    }

    // про гравця
    player = this.physics.add.sprite(100, 450, 'dude')
        .setDepth(5)
        .setBounce(0.2)
        .setCollideWorldBounds(false);

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
        repeat: worldWidth / 100,
        setXY: { x: 12, y: 0, stepX: 100 }
    });

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    // коллайдер зірочок та платформ
    this.physics.add.collider(stars, platforms);

    //  стикання колайдера гравця з колайдером зірочок
    this.physics.add.overlap(player, stars, collectStar, null, this);


    // життя
    hearts = this.physics.add.group({
        key: 'heartss',
        repeat: 10,
        setXY: { x: 12, y: 0, stepX: Phaser.Math.FloatBetween(1000, 2500) }
    }); 

    hearts.children.iterate(function(child) {
        child.setScale(0.07);
    });

    hearts.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    // коллайдер життів та платформ
    this.physics.add.collider(hearts, platforms);

    //  стикання колайдера гравця з колайдером життів
    this.physics.add.overlap(player, hearts, collectHeart, null, this);



    //  рахунок
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' })
        .setOrigin(0, 0)
        .setScrollFactor(0);

    // життя
    lifeText = this.add.text(1500, 20, showLife(), { fontSize: '40px', fill: '#000' })
        .setOrigin(0, 0)
        .setScrollFactor(0);

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



    bullets = this.physics.add.group();

    this.physics.add.collider(bullets, platforms, function (bullet) {
        bullet.destroy();
    }, null, this);

    this.input.on('pointerdown', function (pointer) {
        if (pointer.leftButtonDown()) {
            fireBullet();
        }
    }, this);

    this.physics.add.overlap(bullets, stars, destroyBulletAndObject, null, this);
    this.physics.add.overlap(bullets, bombs, destroyBulletAndObject, null, this);
    this.physics.add.overlap(bullets, box, destroyBulletAndObject, null, this);
    this.physics.add.overlap(bullets, bush, destroyBulletAndObject, null, this);
    this.physics.add.overlap(bullets, rock, destroyBulletAndObject, null, this);
}

function update() {
    // саме управління
    if (cursors.left.isDown) {
        player.setVelocityX(-config.playerSpeed);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(config.playerSpeed);

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
    scoreText.setText('Score: ' + score);

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


function collectHeart(player, heart) {
    heart.disableBody(true, true);

    life += 1;

    lifeText.setText(showLife());

    console.log(life)
}

function showLife() {
    var lifeLine = ''

    for (var i = 0; i < life; i++) {
        lifeLine += '💖'
    }

    return lifeLine
}


// опис бомбочок
function hitBomb(player, bomb) {
    life -= 1;
    bomb.disableBody(true, true);
    lifeText.setText(showLife());

    if (life === 0) {
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        gameOver = true;

        const helloButton = this.add.text(600, 400, 'Restart game', { fontSize: 90, fill: '#FFF', backgroundColor: '#111' })
            .on('pointerdown', () => this.scene.restart(), life = 5)
            .setScrollFactor(0)
            .setInteractive();
    }
}


function fireBullet() {
    var bullet = bullets.create(player.x, player.y, 'bullett');
    bullet.setScale(0.03).setVelocityX(player.flipX ? -500 : 500); // Встановлення швидкості снаряду в залежності від напрямку гравця

    // Визначення напрямку, в якому дивиться гравець і встановлення відповідного значення швидкості по горизонталі
    if (cursors.left.isDown) {
        bullet.setVelocityX(-config.playerSpeed);
    } else {
        bullet.setVelocityX(config.playerSpeed);
    }
}
function destroyBulletAndObject(bullet, object) {
    bullet.destroy();
    object.destroy();
}