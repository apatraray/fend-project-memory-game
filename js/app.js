/*
 * Create a list that holds all of your cards
 */

const cards = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o',
              'fa-anchor', 'fa-anchor', 'fa-bolt', 'fa-bolt',
              'fa-cube', 'fa-cube', 'fa-bomb', 'fa-bomb',
              'fa-leaf', 'fa-leaf', 'fa-bicycle', 'fa-bicycle'];
const timer = document.querySelector('.timer');

// Shuffle function from http://stackoverflow.com/a/2450976

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/*
 * start the game with initGame function which will display the cards on the page by
 *   - shuffle the list of cards
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
*/

function initGame(){
    const gameDeck = document.querySelector('.deck');
    shuffle(cards);
    const cardHtml = cards.map(function getCardTemplate(card){
      return `<li class="card"><i class="fa ${card}"></i></li>`;
    });
    gameDeck.innerHTML = cardHtml.join(' ');
}
initGame();

const allCardList = document.querySelectorAll('.card');
const moves = document.querySelector('.moves');
const restart = document.querySelector('.fa-repeat');
const stars = document.querySelector('.stars');
const winBox = document.querySelector('#winBox');
const failBox = document.querySelector('#failBox');
const closeList = document.querySelectorAll('.close');
const modalList = document.querySelectorAll('.modal');
const winningTime = document.querySelector('.winningTime');
const winningStars = document.querySelector('.winningStars');
let openCardList = [];
let NumberOfCardMatchedPair = 0;
let NumberOfMoves = 0;
let cardMatched = 2;
let seconds = 40;
let starNumber=stars.children.length -1;
let isWinner = false;
let isRestart = false;

/*
 * start timer when game starts
 *   - If user chooses restart, restart the timer, restart the star rating
 *   - If user wins the game, stop the timer, display the winning time and star rating
 *   - If user fail to win the game, stop the timer
*/

let startSec = 0;
let totalSec = 0;
let startMin = 0;
let elapsedString = " ";
function addTimer(){
let x = setInterval(function(){
  if(isRestart){
    startSec = 0;
    totalSec = 0;
    startMin = 0;
    elapsedString = " ";
    NumberOfCardMatchedPair = 0;
    cardMatched = 2;
    seconds = 40;
    for(let currentStarNumber = starNumber; currentStarNumber <= stars.children.length -1; currentStarNumber++ ){
        stars.children[currentStarNumber].firstChild.classList.add('checked');
    }
    starNumber=stars.children.length -1;
    isRestart = false;
  }
  startSec++;
  totalSec++;
  if(startSec > 60){
     startMin++;
     startSec = 0;
  }
  if(startSec > 9) {
    elapsedString = "0"+startMin+":"+startSec;
  }
  else {
    elapsedString = "0"+startMin+":"+"0"+startSec;
  }
  timer.innerHTML = elapsedString;
  if(isWinner){
      clearInterval(x);
      winningTime.innerHTML = elapsedString;
      winningStars.innerHTML = starNumber + 1;
  }
  if (totalSec > 120) {
    clearInterval(x);
    if(!isWinner){
        failBox.style.display = "block";
    }
  }
  updateStars();
}, 1000);
}
addTimer();

/*
 *  Add event listener for each card
 *   - If user clicks the card, open and show the card
 *   - If there is only one card open, remove event listener for that cards
 *   - If both card are open and they match, remove the event listener for this card too.
 *   - If both card are open and they unmatch, add the event listener for the previous open card.
 *   - If both card are open, shake the cards and openCardList array as empty.
 *   - If all cards are matched, display a message with the final score
*/

allCardList.forEach(function(card){
    card.addEventListener('click', showCard);
});
function showCard(event){
    NumberOfMoves++;
    moves.innerText = NumberOfMoves;
    event.target.classList.add('open', 'show');
    setTimeout(function checkMatchCard(){
    openCardList.push(event.target);
    openCardList.forEach(function(card){
        if(openCardList.length == 1){
           event.target.removeEventListener('click', showCard);
        }
        else if(openCardList.length == 2){
           if(openCardList[0].children[0].className !== openCardList[1].children[0].className){
               openCardList[0].classList.remove('open', 'show');
               openCardList[1].classList.remove('open', 'show');
               openCardList[0].addEventListener('click', showCard);
           }
           else{
               openCardList[0].classList.add('match');
               openCardList[1].classList.add('match');
               NumberOfCardMatchedPair++;
               if(NumberOfCardMatchedPair == 8){
                   winBox.style.display = "block";
                   isWinner = true;
            }
            openCardList[1].removeEventListener('click', showCard);
         }
         openCardList[0].classList.add('shake');
         openCardList[1].classList.add('shake');
         openCardList = [];
       }
     });
   }, 1000);
 }

 /*
  * add event listener to close link
  *   - close modal when clicked on close link
 */

 closeList.forEach(function(close){
     close.addEventListener('click', closeModal);
 });

 /*
  * add event listener to modal
  *   - close modal when clicked anywhere in modal
 */

 modalList.forEach(function(modal){
     modal.addEventListener('click', closeModal);
 });
 function closeModal(event){
   event.target.style.display = "none";
 }

 /*
  * add event listener to restart the game
  *   - if the card has open, show or match class, add the eventlistener again.
  *   - remove the card with open, show or match class
  *   - make openCardList array empty
 */

 restart.addEventListener('click', restartGame);
 function restartGame(){
     NumberOfMoves = 0;
     moves.innerText = NumberOfMoves;
     allCardList.forEach(function(card){
       if(card.classList.contains('open')|| card.classList.contains('show') ||
        card.classList.contains('match')){
           card.addEventListener('click', showCard);
           card.classList.remove('open', 'show', 'match');
       }
     });
     openCardList = [];
     isRestart = true;
 }

 /*
  *  Update the stars based on the time taken to find the matched pair.
  *  - for each 40 seconds if there is less than 2 matched pairs done, then decrement the star rating.
  */

 function updateStars(){
   if(NumberOfCardMatchedPair < cardMatched && totalSec >= seconds){
      stars.children[starNumber].firstChild.classList.remove('checked');
      cardMatched += 3;
      seconds += 40;
      starNumber--;
   }
 }
