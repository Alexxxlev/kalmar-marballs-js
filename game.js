let playerCountBalls = 10,
  compCountBalls = 10,
  playBtn = document.querySelector('.play'),
  playerBag = document.querySelector('.player-bag'),
  compImg = document.querySelector('.comp-img'),
  playerImg = document.querySelector('.player-img'),
  playerCount = document.querySelector('.player__count'),
  playerCountBtn = document.querySelector('.player__count-btn'),
  evenBtn = document.querySelector('.even'),
  oddBtn = document.querySelector('.odd'),
  results = document.querySelector('.game__results'),
  guessCompBalls, // Число которое загадал ПК
  guessPlayerBalls, // Число которое загадал игрок
  compEvenOdd, // Выборы ПК(чет/нечет)
  messages = {
    'wrong_bet': 'Неверная ставка',
    'start': 'Сделай ставку и выбери Четное/Нечетное',
    'step_456': 'Угадывает 456! <br>Сделай ставку и выбери Четное/Нечетное',
    'guess_456': 'Угадывает 456! <br>Сделай ставку',
    'win_456': 'Игра окончена! Победил 456',
    'res_456': '456 сделал ставку',
    'step_001': 'Угадывает 001! <br>Сделай ставку',
    'guess_001': 'Угадывает 001! <br>Сделай ставку',
    'win_001': 'Игра окончена! Победил 001',
    'res_001': '001 сделал ставку'
  };

let compTotal = document.querySelector('.comp__total'),
  playerTotal = document.querySelector('.player__total'); // Нужно будет скрыть


const step = true, // Ход игрока
  playText = document.querySelector('.play__text');

// Запуск игры сначала
playBtn.addEventListener('click', play);
function play() {
  playBtn.classList.add('hide');
  playerCountBalls = 10;
  compCountBalls = 10;
  results.innerHTML = '';
  playText.innerHTML = messages.start;
  compImg.setAttribute('src', 'img/001-sad.jpg');
  playerImg.setAttribute('src', 'img/456-sad.jpg');
  playerCount.removeAttribute('disabled');
  playerCountBtn.removeAttribute('disabled');
  evenBtn.setAttribute('disabled', 'disabled');
  oddBtn.setAttribute('disabled', 'disabled');
  createBalls(playerCountBalls, compCountBalls);
  stepPlayers(step);
  writeStep(step);
}

// Перерасчет шариков и смена картинки мешка
function createBalls(playerCount, compCount) {
  playerCount >= 20 || playerCount <= 0 ?
    playerBag.setAttribute('src', 'img/empty.png') :
    playerBag.setAttribute('src', `img/${playerCount}.png`);

  playerTotal.innerHTML = playerCount;
  // compTotal.innerHTML = compCount; // Для разработчика ================
}

// Ставка и выбор ПК
function compGuess() {
  // Ставка ПК случайным образом от 1 до его кол-ва шариков
  guessCompBalls = Math.round(Math.random() * (compCountBalls - 1) + 1);
  // Случайный выбор четное или нечетное
  compEvenOdd = Math.round(Math.random());
  // console.log('Ставка ПК -' + guessCompBalls); // Для разработчика ================
  // if (compEvenOdd) console.log('ПК выбрал нечетное');
  // else console.log('ПК выбрал четное'); // Для разработчика ================
}

// Определение хода игроков
function stepPlayers(step) {
  // console.log(step); // Для разработчика ================
  compGuess(); // Загадывает ПК
  if (step) { // Если ходит игрок
    // playText.innerHTML = messages.start;
    playerCountBtn.addEventListener('click', function st_pl() {
      guessPlayerBalls = +playerCount.value; // Получаем значение из поля
     
      // Проверка на правильность введенного значения
      if (guessPlayerBalls == 0 || guessPlayerBalls > playerCountBalls || isNaN(guessPlayerBalls)) {
        playText.innerHTML = messages.wrong_bet;
        setTimeout(() => {
          playText.innerHTML = messages.guess_456;
          playerCount.value = '';
        }, 2000);
      } else { // Если прошли валидацию
        playerCount.setAttribute('disabled', 'disabled');
        playerCountBtn.setAttribute('disabled', 'disabled');
        evenBtn.removeAttribute('disabled');
        oddBtn.removeAttribute('disabled');
        playerCount.value = '';
        this.removeEventListener('click', st_pl);
      }
    });
  } else { // Если ходит ПК
    // playText.innerHTML = messages.guess_001;
    evenBtn.setAttribute('disabled', 'disabled');
    oddBtn.setAttribute('disabled', 'disabled');
    playerCount.removeAttribute('disabled');
    playerCountBtn.removeAttribute('disabled');
    
    playerCountBtn.addEventListener('click', function st_pc() {
      guessPlayerBalls = +playerCount.value; // Получаем значение из поля
      // Проверка на правильность введенного значения
      if (guessPlayerBalls == 0 || guessPlayerBalls > playerCountBalls || isNaN(guessPlayerBalls)) {
        playText.innerHTML = messages.wrong_bet;
        setTimeout(() => {
          playText.innerHTML = messages.guess_456;
          playerCount.value = '';
        }, 2000);
      } else { // Если прошли валидацию
        writeBets(messages.res_001, guessCompBalls, compEvenOdd);
        checkWinner(guessCompBalls, guessPlayerBalls, compEvenOdd, step);
        playerCount.value = '';
        this.removeEventListener('click', st_pc);
      }
    });
  }
}

// Выбор игрока
evenBtn.addEventListener('click', function() {
  checkWinner(guessCompBalls, guessPlayerBalls, 0, step);
  writeBets(messages.res_456, guessPlayerBalls, 0);
});
oddBtn.addEventListener('click', function() {
  checkWinner(guessCompBalls, guessPlayerBalls, 1, step);
  writeBets(messages.res_456, guessPlayerBalls, 1);
});

// Запись в таблицу чей сейчас ход
function writeStep(step) {
  let item = document.createElement('div');
  if (step) {
    step = 'игрока';
  } 
  else {
    step = 'ПК';
  }
  item.innerHTML = `Ход ${step}`;
  results.append(item);
}

// Запись ставок в таблицу
function writeBets(messBet, countBalls, choices) {
  let item = document.createElement('div');
  item.innerHTML = `${messBet} <strong>${countBalls}</strong> и выбрал ${choices ? 'нечетное' : 'четное'}`;
  results.append(item);
}

// Запись результатов хода в таблицу
function writeResultStep(mess, countBalls) {
  let item = document.createElement('div');
  item.innerHTML = `${mess} <strong>${countBalls}</strong> шариков`;
  results.append(item);
}

// Функция отключения кнопок игрока в случае окончания игры
function disabledButtons() {
  playerCount.setAttribute('disabled', 'disabled');
  playerCountBtn.setAttribute('disabled', 'disabled');
  evenBtn.setAttribute('disabled', 'disabled');
  oddBtn.setAttribute('disabled', 'disabled');
}

function checkWinner(valueComp, valuePlayer, check, step) {
  // Если ходит игрок и угадывает ставку ПК
  if (valueComp % 2 == check && step) {
    playerCountBalls += valuePlayer; // Игрок к своим шарикам прибавляет свою ставку
    compCountBalls -= valuePlayer; // Отнять у ПК ставку игрока
    createBalls(playerCountBalls, compCountBalls);
    // Сообщение в таблицу о результате хода
    setTimeout(() => {
      writeResultStep('456 выиграл', valuePlayer);
    }, 500);
  }
  // Если ходит ПК и не угадывает ставку игрока
  if (valuePlayer % 2 != check && !step) {
    playerCountBalls += valueComp; // Игрок к своим шарикам прибавляет ставку ПК
    compCountBalls -= valueComp; // Отнять у ПК его ставку
    createBalls(playerCountBalls, compCountBalls);
    // Сообщение в таблицу о результате хода
    setTimeout(() => {
      writeResultStep('456 выиграл', valueComp);
    }, 500);
  }
  // Если ходит игрок и угадывает ставку ПК и если ходит ПК и не угадывает ставку игрока(общие условия)
  if ((valueComp % 2 == check && step) || (valuePlayer % 2 != check && !step)) {
    playText.innerHTML = messages.guess_456;
    playerImg.setAttribute('src', 'img/456-happy.jpg');
    compImg.setAttribute('src', 'img/001-sad.jpg');
  }
  // Если ходит игрок и не угадывает ставку ПК и если ходит ПК и угадывает ставку игрока
  if ((valueComp % 2 != check && step) || (valuePlayer % 2 == check && !step)) {
    playText.innerHTML = messages.guess_001;
    playerCountBalls -= valueComp; // Отнять у игрока ставку ПК
    compCountBalls += valueComp; // ПК к своим шарикам прибавляет свою ставку
    createBalls(playerCountBalls, compCountBalls);
    playerImg.setAttribute('src', 'img/456-sad.jpg');
    compImg.setAttribute('src', 'img/001-happy.jpg');
    // Сообщение в таблицу о результате хода
    setTimeout(() => {
      writeResultStep('001 выиграл', valueComp);
    }, 500);
  }

  // Сообщение в таблицу о том чей сейчас ход
  setTimeout(() => {
    writeStep(step);
  }, 500);

  // Условие окончания игры
  if (playerCountBalls >= 20) {
  playText.innerHTML = messages.win_456;
  playBtn.classList.remove('hide');
  disabledButtons();
  return;
  } if (compCountBalls >= 20) {
  playText.innerHTML = messages.win_001;
  playBtn.classList.remove('hide');
  disabledButtons();
  return;
  }
  step = !step; // Менять ход
  stepPlayers(step); // Запуск нового хода
}

// Автопрокрутка сообшений в поле результатов
var checkbottom;
jQuery(function($) {
  $('.game__results').on('scroll', function() {
    var check = $(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight;
    if(check) {
      checkbottom = "bottom";
    } else {
      checkbottom = "nobottom";
    }
  })
});
window.setInterval(function(){
  if (checkbottom=="bottom") {
    results.scrollTop = results.scrollHeight;
  }
}, 500);
