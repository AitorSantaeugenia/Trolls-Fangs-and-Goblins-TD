// Preload critical images
const preloadImages = () => {
  const criticalImages = [
    'images/towers/flameTurret.png',
    'images/towers/flameTurret_unk.png',
    'images/towers/sandTurret.png',
    'images/towers/stoneTurret.png',
    'images/towers/freezeTurret.png',
    'images/utils/gif.webp'
  ];

  criticalImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
};

//all audios
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audioEnemy = [];
const audioJobDone = [];

window.onload = function () {
  preloadImages();
  const gameInterface = document.getElementById("startingMenu");

  const start = new StartGame();
  const canvasContainer = document.getElementById("canvasContainer");
  const gameMenu = document.getElementById("gameMenu");
  const startGameButton = document.getElementById("startGame");
  //turrets
  const sandTurret = document.getElementById("sandTurret");
  const cataTurret = document.getElementById("cataTurret");
  const slowTurret = document.getElementById("slowTurret");
  const flameTurret = document.getElementById("flameTurret");
  const priceTurret = document.getElementById("idGoldTurretCost");
  //audio
  const audio1 = document.getElementById("startingGameAudio");

  let soundOn = document.getElementById("yesSound");
  let soundOff = document.getElementById("noSound");
  //misc
  let turretSelected = "";
  let cheatCodeInput = document.getElementById("cheatCodes");
  let cheatInput = document.getElementById("inputCheatCode");
  let exitButton = document.getElementById("exitButtonEndGameMenu");
  let restartLvlButton = document.getElementById("restartButtonEndGameMenu");
  let isMessageAnimating = false; // Add flag to track animation state

  // Starting v.02
  // HOME MENU - LVL SELECTION UI
  // DIV container to select lvls
  const selectedEasy = document.getElementById("selectedEasy");
  const selectedNormal = document.getElementById("selectedNormal");
  const selectedHard = document.getElementById("selectedHard");
  const selectedHell = document.getElementById("selectedHell");
  // Hover DIV select lvls, we use this to know which lvl difficulty
  const selectedTrueEasy = document.getElementById("selectedTrueEasy");
  const selectedTrueNormal = document.getElementById("selectedTrueNormal");
  const selectedTrueHard = document.getElementById("selectedTrueHard");
  const selectedTrueHell = document.getElementById("selectedTrueHell");

  // PAUSE MENU - buttons
  //continue button
  const continueButtonFromPause = document.getElementById("continuePauseBtn");
  //restart button
  const restartButtonFromPause = document.getElementById("restartPauseBtn");
  //exit button
  const exitButtonFromPause = document.getElementById("toMenuPauseBtn");
  const instructionsPauseBtn = document.getElementById("instructionsPauseBtn");

  //STARTING MENU - buttons
  //instructions button in starting Menu
  const instructionButton = document.getElementById("instructionsBtn");
  const instructionsGameUI = document.getElementById("instructionsGameUI");
  const instructionsGameCloseBtn = document.getElementById(
    "instructionsGameCloseBtn"
  );
  const closeXBtnInstructions = document.getElementById(
    "closeXBtnInstructions"
  );
  //custom game buttons in starting menu
  const customGameBtn = document.getElementById("customGameBtn");
  const customGameUI = document.getElementById("customGameUI");
  const customGameCloseBtn = document.getElementById("customGameCloseBtn");
  const closeXBtnCustom = document.getElementById("closeXBtnCustom");
  //ranked buttons in starting menu
  const rankedGameBtn = document.getElementById("rankedGameBtn");
  const rankedGameUI = document.getElementById("rankedGameUI");
  const rankedGameCloseBtn = document.getElementById("rankedGameCloseBtn");
  const closeXBtnRanked = document.getElementById("closeXBtnRanked");

  //adding new image - easter egg coffin dancers
  const deathCoffinDance = document.getElementById("coffinDancers");
  // deathCoffinDance.classList.add("hidden");

  //game difficulty - default Easy
  let gameDifficulty = "Easy";

  //canvas for mousemove
  const canvas = document.getElementById("canvas");

  // Events
  // event to know which lvl difficulty is selected and do some behaviour or another in canvas
  document.addEventListener("click", function () {
    if (selectedTrueEasy.getAttribute("activationlvl") === "true") {
      gameDifficulty = "Easy";
    } else if (selectedTrueNormal.getAttribute("activationlvl") === "true") {
      gameDifficulty = "Normal";
    } else if (selectedTrueHard.getAttribute("activationlvl") === "true") {
      gameDifficulty = "Hard";
    } else if (selectedTrueHell.getAttribute("activationlvl") === "true") {
      gameDifficulty = "Hell";
    } else {
      gameDifficulty = "Easy";
    }
  });

  //event to insert cheatcodes when ENTER key is pressed
  document.addEventListener("keydown", (event) => {
    let cheatCodeClass = cheatCodeInput.classList;
    let textToUpper = cheatInput.value;
    textToUpper = textToUpper.toLowerCase();
    let textDefault = "Insert cheat code...";

    //In game cheats
    if (event.key === "Enter" && cheatCodeClass == "hidden") {
      cheatCodeInput.classList.remove("hidden");
      //when clicking ENTER to insert a cheatcode, it get focus of the whole text, you need just start typing
      let checkLength = cheatInput.value;
      checkLength = checkLength.length;
      cheatInput.focus();
      cheatInput.setSelectionRange(0, checkLength);
    } else if (event.key === "Enter" && cheatCodeClass == "") {
      if (textToUpper === "greedisgood") {
        start.cheatCodeGold();
        document.getElementById("inputCheatCode").value = textDefault;
      } else if (textToUpper === "ezwin") {
        start.gameWin();
        document.getElementById("inputCheatCode").value = textDefault;
      } else if (textToUpper === "4lose") {
        start.gameLost();
        document.getElementById("inputCheatCode").value = textDefault;
      } else if (textToUpper === "hollymolly") {
        start.cheatCodeGoldToTheMoon();
        document.getElementById("inputCheatCode").value = textDefault;
      } else if (textToUpper === "whosyourdaddy") {
        const flameTurret = document.getElementById("flameTurret");
        flameTurret.classList.remove("locked", "hidden");
        flameTurret.src = "images/towers/flameTurret.png";
        document.getElementById("inputCheatCode").value = textDefault;
      } else if (textToUpper === "thanos") {
        start.thanosSnap();
        document.getElementById("inputCheatCode").value = textDefault;
      } else {
        document.getElementById("inputCheatCode").value = textDefault;
      }
      cheatCodeInput.classList.add("hidden");
    }
  });

  // Selecting lvl MENU - adding hover img with level instructions
  // Level EASY
  selectedEasy.addEventListener("click", function () {
    if (selectedTrueEasy.style.visibility === "hidden") {
      selectedTrueNormal.style.visibility = "hidden";
      selectedTrueEasy.style.visibility = "visible";
      selectedTrueHard.style.visibility = "hidden";
      selectedTrueHell.style.visibility = "hidden";
      selectedTrueEasy.setAttribute("activationLvl", "true");
      selectedTrueNormal.setAttribute("activationLvl", "false");
      selectedTrueHard.setAttribute("activationLvl", "false");
      selectedTrueHell.setAttribute("activationLvl", "false");
    } else if ((selectedTrueEasy.style.visibility = "visible")) {
      selectedTrueEasy.style.visibility = "hidden";
      selectedTrueEasy.setAttribute("activationLvl", "false");
    }
  });
  // Level NORMAL
  selectedNormal.addEventListener("click", function () {
    if (selectedTrueNormal.style.visibility === "hidden") {
      selectedTrueNormal.style.visibility = "visible";
      selectedTrueEasy.style.visibility = "hidden";
      selectedTrueHard.style.visibility = "hidden";
      selectedTrueHell.style.visibility = "hidden";
      selectedTrueEasy.setAttribute("activationLvl", "false");
      selectedTrueNormal.setAttribute("activationLvl", "true");
      selectedTrueHard.setAttribute("activationLvl", "false");
      selectedTrueHell.setAttribute("activationLvl", "false");
    } else if ((selectedTrueNormal.style.visibility = "visible")) {
      selectedTrueNormal.style.visibility = "hidden";
      selectedTrueNormal.setAttribute("activationLvl", "false");
    }
  });
  // Level HARD
  selectedHard.addEventListener("click", function () {
    if (selectedTrueHard.style.visibility === "hidden") {
      selectedTrueNormal.style.visibility = "hidden";
      selectedTrueEasy.style.visibility = "hidden";
      selectedTrueHard.style.visibility = "visible";
      selectedTrueHell.style.visibility = "hidden";
      selectedTrueEasy.setAttribute("activationLvl", "false");
      selectedTrueNormal.setAttribute("activationLvl", "false");
      selectedTrueHard.setAttribute("activationLvl", "true");
      selectedTrueHell.setAttribute("activationLvl", "false");
    } else if ((selectedTrueHard.style.visibility = "visible")) {
      selectedTrueHard.style.visibility = "hidden";
      selectedTrueHard.setAttribute("activationLvl", "false");
    }
  });
  // Level HELL
  selectedHell.addEventListener("click", function () {
    if (selectedTrueHell.style.visibility === "hidden") {
      selectedTrueNormal.style.visibility = "hidden";
      selectedTrueEasy.style.visibility = "hidden";
      selectedTrueHard.style.visibility = "hidden";
      selectedTrueHell.style.visibility = "visible";
      selectedTrueEasy.setAttribute("activationLvl", "false");
      selectedTrueNormal.setAttribute("activationLvl", "false");
      selectedTrueHard.setAttribute("activationLvl", "false");
      selectedTrueHell.setAttribute("activationLvl", "true");
    } else if ((selectedTrueHell.style.visibility = "visible")) {
      selectedTrueHell.style.visibility = "hidden";
      selectedTrueHell.setAttribute("activationLvl", "false");
    }
  });

  // PAUSE GAME - HIDE UIs
  //if game started, clickin ESC show us the PAUSE GAME UI
  //if game didn't start, we use ESC to hide instructions/customGameUI, preventing some bugs with the third var gameStarted
  document.addEventListener("keydown", (e) => {
    //this will prevent to call PAUSE when game is false (like win/lose scenarios)
    let gameStatus = start.checkGameStatus();
    let pauseStatus = start.checkPauseStatus();
    //this var prevents us to click ESC while in Starting menu
    let gameStarted = start.checkGameStarted();

    //if game didn't start and we click ESC, we just hide two menu UI (instructions & customgame)
    //if we are in instructions/customgame UIs, then we can click ESC to hide it too
    if (gameStarted === "false") {
      instructionsGameUI.classList.add("hidden");
      customGameUI.classList.add("hidden");
      rankedGameUI.classList.add("hidden");

      closePanel();

      closeAccordion();
    }

    //we do this because we want to press ESC to exit instructions menu UI when game is not started (in game menu), but also because
    //we want to use ESC to close instructions menu IU in pause menu while playing, and if the instruction menu UI is hidden while playing
    //and we press ESC, it will just toggle the pause menu (from show to hide)
    //so we can use ESC key to both close instruction menu and exiting the pause menu while playing (and also exiting the instruction UI menu at start)
    if (
      gameStatus === "true" &&
      pauseStatus === "false" &&
      gameStarted === "true"
    ) {
      if (e.code === "Escape") {
        start.pauseGame();
      }
    } else if (
      gameStatus === "false" &&
      pauseStatus === "true" &&
      gameStarted === "true" &&
      !instructionsGameUI.classList.contains("hidden")
    ) {
      instructionsGameUI.classList.add("hidden");
      closePanel();

      closeAccordion();
    } else if (
      gameStatus === "false" &&
      pauseStatus === "true" &&
      gameStarted === "true" &&
      instructionsGameUI.classList.contains("hidden")
    ) {
      if (e.code === "Escape") {
        start.pauseGame();
      }
    }
  });

  // if we click continue (only showed at paused menu) we call start.pauseGame
  // with status false, and change to true to continue (same as clicking ESC again)
  continueButtonFromPause.addEventListener("click", function () {
    start.pauseGame();
  });

  // restart lvl from paused menu
  restartButtonFromPause.addEventListener("click", function () {
    start.restartLvl();
  });

  // refresh webpage as exit the game
  exitButtonFromPause.addEventListener("click", function () {
    location.reload();
  });

  //Other functions
  function getCursorPosition(canvas, event) {
    let range = canvas.getBoundingClientRect();
    const x = event.clientX - range.left;
    const y = event.clientY - range.top;

    return {
      x: x,
      y: y,
      click: event.button,
    };
  }

  canvas.onmousedown = (event) => {
    start.createTurret(getCursorPosition(canvas, event), turretSelected);
  };

  canvas.onmousemove = (event) => {
    let animationDrawRangeAndTurret = requestAnimationFrame(() => {
      start.drawPlaceholderTurretAndRange(
        getCursorPosition(canvas, event),
        turretSelected
      );
    });
  };

  //when clicking the INPUT to insert a cheatcode, selects the whole text, then you just need to start typing
  //is not necessary since we implemented it at line #80, but it's a better behaviour than without it
  cheatCodeInput.addEventListener("click", function () {
    let checkLength = cheatInput.value;
    checkLength = checkLength.length;
    cheatInput.setSelectionRange(0, checkLength);
  });

  startGameButton.addEventListener("click", function () {
    start.setDifficultyLvl(gameDifficulty);
    gameInterface.classList.remove("startingMenu");
    canvasContainer.classList.remove("hidden");
    gameInterface.classList.add("hidden");
    gameMenu.classList.remove("hidden");
    audio1.volume = 0.1;
    audio1.play();
    startGame();
  });

  exitButton.addEventListener("click", function () {
    start.exitGame();
  });

  restartLvlButton.addEventListener("click", function () {
    start.restartLvl();
  });

  sandTurret.addEventListener("click", function () {
    turretSelected = "sand";
    priceTurret.innerHTML = "$70";
    start.checkTurretSelected(turretSelected);
  });

  cataTurret.addEventListener("click", function () {
    turretSelected = "catapult";
    priceTurret.innerHTML = "$150";
    start.checkTurretSelected(turretSelected);
  });

  slowTurret.addEventListener("click", function () {
    turretSelected = "slow";
    priceTurret.innerHTML = "$200";
    start.checkTurretSelected(turretSelected);
  });

  flameTurret.addEventListener("click", function () {
    const message = document.getElementById("flameTurretMessage");
    if (this.src.includes('unk') && !isMessageAnimating) {
      isMessageAnimating = true;
      const text = "Hmm, how to unlock this one?";
      message.innerHTML = `<span>${text}</span>`;
      message.classList.remove("hidden");
      message.style.animation = "blink-caret 0.75s step-end infinite";
      
      setTimeout(() => {
        message.classList.add("hidden");
        isMessageAnimating = false;
      }, 4000);
    } else if (!this.src.includes('unk')) {
      turretSelected = "flame";
      priceTurret.innerHTML = "$300";
      start.checkTurretSelected(turretSelected);
    }
  });

  soundOn.addEventListener("click", function () {
    soundOn.classList.add("buttonSelectedBorder");
    soundOff.classList.remove("buttonSelectedBorder");
    soundOff.setAttribute("isActive", "false");
    soundOn.setAttribute("isActive", "true");
  });

  soundOff.addEventListener("click", function () {
    soundOff.classList.add("buttonSelectedBorder");
    soundOn.classList.remove("buttonSelectedBorder");
    soundOn.setAttribute("isActive", "false");
    soundOff.setAttribute("isActive", "true");
  });

  function startGame() {
    start.run();
  }
  //instructions game menu
  instructionButton.addEventListener("click", function () {
    instructionsGameUI.classList.remove("hidden");
  });

  instructionsPauseBtn.addEventListener("click", function () {
    instructionsGameUI.classList.remove("hidden");
  });

  instructionsGameCloseBtn.addEventListener("click", function () {
    closePanel();

    closeAccordion();
    instructionsGameUI.classList.add("hidden");
  });
  //custom game menu
  customGameBtn.addEventListener("click", function () {
    customGameUI.classList.remove("hidden");
  });

  customGameCloseBtn.addEventListener("click", function () {
    customGameUI.classList.add("hidden");
  });
  //ranked game menu
  rankedGameBtn.addEventListener("click", function () {
    rankedGameUI.classList.remove("hidden");
  });

  rankedGameCloseBtn.addEventListener("click", function () {
    rankedGameUI.classList.add("hidden");
  });

  //x button in top of UIs
  closeXBtnInstructions.addEventListener("click", function () {
    closePanel();

    closeAccordion();

    instructionsGameUI.classList.add("hidden");
  });

  closeXBtnCustom.addEventListener("click", function () {
    customGameUI.classList.add("hidden");
  });

  closeXBtnRanked.addEventListener("click", function () {
    rankedGameUI.classList.add("hidden");
  });
};

//Audios created dynamically for endGame sound minions and jobdone (creating turret)
//we push to an array, and then shift, we shift if length is === 2 because we need to stop the first one
//If the audio is created dinamically, and we click the mute button, if it's the first audio created, it won't work, that's why we shift when length === 2
function soundGoEnemy(newAudio, boolean) {
  if (boolean === true) {
    audioEnemy.push(new Audio(newAudio));
    audioEnemy.forEach((element) => {
      element.volume = 0.1;
      element.play();
    });
  } else {
    audioEnemy.push(new Audio(newAudio));
    audioEnemy.forEach((element) => {
      element.volume = 0;
      element.pause();
    });
  }

  //we add this to prevent the first audio from playing
  //if we do a shift before length > 2 (length ===1) we can't stop it if we mute the game
  if (audioEnemy.length === 2) {
    audioEnemy[0].volume = 0;
    audioEnemy[0].pause();
    audioEnemy.shift();
  }
}

function soundGoJobDone(newAudio, boolean) {
  if (boolean === true) {
    audioJobDone.push(new Audio(newAudio));
    audioJobDone.forEach((element) => {
      element.volume = 0.1;
      element.play();
    });
  } else {
    audioJobDone.push(new Audio(newAudio));
    audioJobDone.forEach((element) => {
      element.volume = 0;
      element.pause();
    });
  }

  //we add this to prevent the first audio from playing
  //if we do a shift before length > 2 (length ===1) we can't stop it if we mute the game
  if (audioJobDone.length === 2) {
    audioJobDone[0].volume = 0;
    audioJobDone[0].pause();
    audioJobDone.shift();
  }
}
//Acordion for instructions menu
let acc = document.getElementsByClassName("accordion");
let i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    acc[0].classList.remove("active");
    acc[0].nextElementSibling.style.display = "none";
    acc[1].classList.remove("active");
    acc[1].nextElementSibling.style.display = "none";
    acc[2].classList.remove("active");
    acc[2].nextElementSibling.style.display = "none";
    acc[3].classList.remove("active");
    acc[3].nextElementSibling.style.display = "none";

    this.classList.add("active");

    let panel = this.nextElementSibling;
    if (panel.style.display === "contents") {
      panel.style.display = "none";
    } else {
      panel.style.display = "contents";
    }
  });
}

// Gallery functionality
function setupGallery(slideClass, buttonClass, imgClass, buttonImgClass) {
  const slides = document.querySelectorAll(slideClass);
  const buttons = document.querySelectorAll(buttonClass);
  let current = 0;

  // Initial setup
  slides[current].style.zIndex = 2;
  buttons[0].classList.add("inactive");
  buttons[buttons.length - 1].classList.add("inactive");
  const activeButtons = document.querySelectorAll(`${buttonClass}:not(.inactive)`);

  // Single event listener for all buttons
  activeButtons.forEach(button => {
    button.addEventListener("click", function() {
      // Update current index
      if (this.classList.contains("button-right") || this.classList.contains("button-right-min") || this.classList.contains("button-right-lvl")) {
        current = Math.min(current + 1, slides.length - 1);
      } else {
        current = Math.max(current - 1, 0);
      }

      // Update all slides and buttons
      slides.forEach((slide, index) => {
        slide.style.zIndex = index === current ? "2" : "0";
      });

      document.querySelectorAll(imgClass).forEach(img => img.classList.add("active"));
      document.querySelectorAll(buttonImgClass).forEach(btn => btn.style.color = "#00000038");

      // Reset after animation
      setTimeout(() => {
        document.querySelectorAll(imgClass).forEach(img => img.classList.remove("active"));
        document.querySelectorAll(buttonImgClass).forEach(btn => btn.style.opacity = "1");
      }, 1000);
    });
  });
}

// Setup all galleries
setupGallery(".slide", ".btnAcordionP", ".slide-img", ".slide-button");
setupGallery(".slideMin", ".btnAcordionMin", ".slide-img-min", ".slide-button-min");
setupGallery(".slideLevel", ".btnAcordionLvl", ".slide-img-lvl", ".slide-button-lvl");

//Remove the classes added previously in the accordion if it closes suddenly
function closeAccordion() {
  for (i = 0; i < acc.length; i++) {
    acc[i].classList.remove("active");
  }
}

//Closes the panel if we click the X button, the close button, or the ESC key
function closePanel() {
  let panel = document.getElementsByClassName("panel");
  for (let i = 0; i < panel.length; i++) {
    if (panel[i].style.display === "contents") {
      panel[i].style.display = "none";
    }
  }
}
