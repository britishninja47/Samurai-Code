const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576



c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.6

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/cyberpunk-street.png'

})

const shop = new Sprite({
  position: {
    x: 320,
    y: 236
  },
  imageSrc: './img/shop.png',
  scale: 2,
  framesMax: 6
})

const player = new Fighter({
  position: {
  x: 0,
  y: 0
},
velocity: {
  x: 0,
  y: 10
},
offset: {
  x: 0,
  y: 0
},
   imageSrc: './img/Ronin/idle.png',
   framesMax: 8,
   scale: 2.6,
   offset: {
    x: 215,
    y: 180,
   },
   sprites: {
    idle: {
      imageSrc: './img/Ronin/idle.png',
      framesMax: 8
    },
       run: {
       imageSrc: './img/Ronin/Run.png',
       framesMax: 8,
    },
       jump: {
       imageSrc: './img/Ronin/Jump.png',
       framesMax: 2,
    },
       fall: {
       imageSrc: './img/Ronin/Fall.png',
       framesMax: 2,
    },
      attack1: {
      imageSrc: './img/Ronin/Attack1.png',
      framesMax: 6,
    },
      takeHit: {
        imageSrc: './img/Ronin/TakeHit1.png',
        framesMax: 4,
    },
       death: {
         imageSrc: './img/Ronin/Death.png',
         framesMax: 6,
       }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 160,
    height: 50
  }
})


const enemy = new Fighter({
  position: {
   x: 910,
   y: 100
},
  velocity: {
   x: 0,
   y: 0
},
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },

  imageSrc: './img/DKnight/idle.png',
   framesMax: 11,
   scale: 2.8,
   offset: {
    x: 190,
    y: 180,
   },
   sprites: {
    idle: {
      imageSrc: './img/DKnight/idle.png',
      framesMax: 11
    },
       run: {
       imageSrc: './img/DKnight/Run.png',
       framesMax: 8,
    },
       jump: {
       imageSrc: './img/DKnight/Jump.png',
       framesMax: 3,
    },
       fall: {
       imageSrc: './img/DKnight/Fall.png',
       framesMax: 3,
    },
      attack1: {
      imageSrc: './img/DKnight/Attack1.png',
      framesMax: 7,
    },
      takeHit: {
        imageSrc: './img/DKnight/Take Hit.png',
        framesMax: 4,
    },
       death: {
        imageSrc: './img/DKnight/Death.png',
        framesMax: 11,
    }
  },
  attackBox: {
    offset: {
      x: -60,
      y: 50,
    },
    width: 100,
    height: 50
  }
})


enemy.draw()

console.log(player)

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

    decreasetimer()

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  c.fillStyle = 'rgba(255, 255, 255, .12)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  // Player movement //
  if (keys.a.pressed && player.lastkey === 'a') {
    player.velocity.x = -5
   player.switchSprite('run')
  } else if (keys.d.pressed && player.lastkey === 'd') {
    player.velocity.x = 5
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }
  // Jumping
   if (player.velocity.y < 0) {
   player.switchSprite('jump')
   } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
   }


  // Enemy Movement //
  if (keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft') {
    enemy.velocity.x = -5
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight') {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }
    // Jumping
   if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
     enemy.switchSprite('fall')
    }

  // DETECT FOR COLLISION + Enemy Gets Hit //
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking && player.framesCurrent === 4
    ) {
      enemy.takeHit()
      player.isAttacking = false

      gsap.to('#enemyHealth', {
        width: enemy.health + '%'
      })
  }

  // If player misses attack //
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }

  // Player gets hit //

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking && enemy.framesCurrent === 2
    ) {
      player.takeHit()
      enemy.isAttacking = false
      gsap.to('#playerHealth', {
        width: player.health + '%'
      })
  }

 // If Enemy misses attack //
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false
  }


   // End of game based on health bar
   if (enemy.health<= 0 || player.health <= 0) {
      determineWinner({ player, enemy, timerId })
   }
}

animate()

window.addEventListener('keydown', (event) => {
  if(!player.dead ) {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true
      player.lastkey = 'd'
    break
    case 'a':
    keys.a.pressed = true
    player.lastkey = 'a'
    break
    case 'w':
     player.velocity.y = -18
    break
    case ' ':
    player.attack()
    break

   }
  }
  if( !enemy.dead) {
  switch(event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      enemy.lastkey = 'ArrowRight'
    break
    case 'ArrowLeft':
    keys.ArrowLeft.pressed = true
    enemy.lastkey = 'ArrowLeft'
    break
    case 'ArrowUp':
     enemy.velocity.y = -18
     break
     case 'ArrowDown':
     enemy.attack()
     break
  }
 }

})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
    break
    case 'a':
    keys.a.pressed = false
    break
  }

  // enemy controls //
  switch (event.key) {
  case 'ArrowRight':
      keys.ArrowRight.pressed = false
    break
    case 'ArrowLeft':
    keys.ArrowLeft.pressed = false
    break
  }
})
