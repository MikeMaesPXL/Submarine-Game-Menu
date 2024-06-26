document.addEventListener('DOMContentLoaded', function() {
  const backgroundMusic = document.getElementById('background-music');
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.5;
  backgroundMusic.play();

  var lastKeyPressTime = 0;
  var menuTimeout;
  var spacebarCount = 0;

  const overlay = document.getElementById('overlay');
  overlay.style.display = 'flex';
  let overlayClicked = false;

  overlay.addEventListener('click', function() {
    if (!overlayClicked) {
      backgroundMusic.play();
      overlayClicked = true;
      overlay.style.display = 'none';
    }
  });

  document.addEventListener('keydown', function(event) {
    if (event.keyCode === 32) { 
      var currentTime = new Date().getTime();
      if (currentTime - lastKeyPressTime < 200) { 
        spacebarCount++;
      } else {
        if (isShakeControlVisible()) {
          cycleShakeOption();
        } else {
          increaseVolume();
        }
        spacebarCount = 1;
      }
      lastKeyPressTime = currentTime;
      clearTimeout(menuTimeout);
      menuTimeout = setTimeout(closeMenu, 3000);
    }
  });

  document.addEventListener('keyup', function(event) {
    if (event.keyCode === 32 && spacebarCount === 3) {
      toggleControls();
      spacebarCount = 0;
      if (!isMenuOpen()) {
        openMenu();
      }
    }
  });

  function toggleControls() {
    var volumeControl = document.getElementById('volumecontrol');
    var shakeControl = document.getElementById('shakecontrol');
    if (volumeControl.style.display === 'flex') {
      volumeControl.style.display = 'none';
      shakeControl.style.display = 'flex';
    } else {
      volumeControl.style.display = 'flex';
      shakeControl.style.display = 'none';
    }
  }

  function isMenuOpen() {
    var menu = document.getElementById('menu');
    return menu.style.display === 'flex';
  }

  function isShakeControlVisible() {
    var shakeControl = document.getElementById('shakecontrol');
    return shakeControl.style.display === 'flex';
  }

  function openMenu() {
    var menu = document.getElementById('menu');
    menu.style.display = 'flex';
    clearTimeout(menuTimeout);
    menuTimeout = setTimeout(closeMenu, 3000);
  }

  function closeMenu() {
    var menu = document.getElementById('menu');
    menu.style.display = 'none';
  }

  function increaseVolume() {
    if (!isMenuOpen() || spacebarCount !== 1) {
      return;
    }
    var volumeSlider = document.getElementById('volume');
    var currentVolume = parseInt(volumeSlider.value);
    volumeSlider.value = currentVolume < 10 ? currentVolume + 1 : 0;
    updateVolume();
  }

  function updateVolume() {
    var volumeSlider = document.getElementById('volume');
    var currentVolume = parseInt(volumeSlider.value);
    backgroundMusic.volume = currentVolume / 10;
    updateVolumeBlocks(currentVolume);
  }

  function updateVolumeBlocks(currentVolume) {
    var volumeBlocks = document.querySelectorAll('.volume-block');
    volumeBlocks.forEach(function(block, index) {
      block.classList.toggle('active', index < currentVolume);
    });
  }

  var volumeBlocksContainer = document.getElementById('volume-blocks');
    for (var i = 0; i <= 9; i++) {
      var block = document.createElement('div');
      block.classList.add('volume-block');
      volumeBlocksContainer.appendChild(block);
    }

  var volumeSlider = document.getElementById('volume');
  volumeSlider.addEventListener('input', updateVolume);
  updateVolume(); 

  function cycleShakeOption() {
    if (!isMenuOpen() || spacebarCount !== 1) {
      return;
    }
    var shakeOptions = document.querySelectorAll('.shake-option');
    var currentIndex = Array.from(shakeOptions).findIndex(option => option.classList.contains('active'));
    var nextIndex = (currentIndex + 1) % shakeOptions.length;

    shakeOptions[currentIndex].classList.remove('active');
    shakeOptions[nextIndex].classList.add('active');
  }

  document.addEventListener('DOMContentLoaded', function() {
    var shakeOptions = document.querySelectorAll('.shake-option');
    shakeOptions.forEach(function(option) {
      option.addEventListener('click', function() {
        shakeOptions.forEach(function(opt) {
          opt.classList.remove('active');
        });
        option.classList.add('active');
      });
    });
  });

  // Game
  const submarine = document.getElementById('submarine');
  const gameScreen = document.getElementById('game-screen');
  const scoreValue = document.getElementById('score-value');

  let submarinePosition = 30;
  let score = 0;
  let isMovingDown = false;

  document.addEventListener('keydown', function(event) {
    if (event.code === 'ArrowUp') {
      isMovingDown = true;
    }
  });

  document.addEventListener('keyup', function(event) {
    if (event.code === 'ArrowUp') {
      isMovingDown = false;
    }
  });

  function moveSubmarine() {
    const moveAmount = 0.6;
    if (isMovingDown) {
      submarinePosition = Math.min(submarinePosition + moveAmount, 90);
    } else {
      submarinePosition = Math.max(submarinePosition - moveAmount, 10);
    }
    submarine.style.bottom = submarinePosition + '%';
  }

  function createDot() {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    gameScreen.appendChild(dot);
  
    const randomY = Math.floor(Math.random() * 90);
    const randomX = Math.floor(Math.random() * 90) + 100;
    dot.style.top = randomY + '%';
    dot.style.left = randomX + 'vw';
  
    // Generate random hue value between 0 and 360
    const randomHue = Math.floor(Math.random() * 360);
    dot.style.filter = `hue-rotate(${randomHue}deg)`;
  
    const moveDotInterval = setInterval(() => {
      const submarineRect = submarine.getBoundingClientRect();
      const dotRect = dot.getBoundingClientRect();
  
      if (
        dotRect.left < submarineRect.right &&
        dotRect.right > submarineRect.left &&
        dotRect.top < submarineRect.bottom &&
        dotRect.bottom > submarineRect.top
      ) {
        score++;
        scoreValue.textContent = score;
        gameScreen.removeChild(dot);
        clearInterval(moveDotInterval);
      } else if (dotRect.left < 0) {
        gameScreen.removeChild(dot);
        clearInterval(moveDotInterval);
      } else {
        const offset = 10 * Math.sin(Date.now() / 1000);
        dot.style.top = randomY + offset + '%';
        dot.style.left = parseFloat(dot.style.left) - 0.5 + 'vw';
      }
    }, 20);
  }
  
  

  setInterval(createDot, 3000);
  setInterval(moveSubmarine, 20);
});
