/*
 * Create a list that holds all of your cards
 */
const cards = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o',
              'fa-anchor', 'fa-anchor', 'fa-bolt', 'fa-bolt',
              'fa-cube', 'fa-cube', 'fa-anchor', 'fa-anchor',
              'fa-leaf', 'fa-leaf', 'fa-bicycle', 'fa-bicycle'];
const timer = document.querySelector('.timer');
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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
let openCardList = [];
let NumberOfCardMatchedPair = 0;
let NumberOfMoves = 0;
let cardMatchedPairPerMoves = 0;
restart.addEventListener('click', restartGame);
allCardList.forEach(function(card){
    card.addEventListener('click', showCard, true);
});
function restartGame(){
    NumberOfMoves = 0;
    moves.innerText = NumberOfMoves;
    allCardList.forEach(function(card){
      card.classList.remove('open', 'show', 'match');
    });
}
function showCard(event){
    NumberOfMoves++;
    moves.innerText = NumberOfMoves;
    event.target.classList.add('open', 'show');
    setTimeout(function checkMatchCard(){
    openCardList.push(event.target);
    openCardList.forEach(function(card){
        if(openCardList.length == 2){
           if(openCardList[0].children[0].className !== openCardList[1].children[0].className){
               openCardList[0].classList.remove('open', 'show');
               openCardList[1].classList.remove('open', 'show');
           }
           else{
               openCardList[0].classList.add('match');
               openCardList[1].classList.add('match');
               NumberOfCardMatchedPair++;
               cardMatchedPairPerMoves = NumberOfCardMatchedPair/NumberOfMoves;
               if(NumberOfCardMatchedPair == 8){
                   console.log('all cards are mathched');//implement modal
            }
         }
         openCardList[0].classList.add('shake');
         openCardList[1].classList.add('shake');
         openCardList = [];
       }
     });
   }, 1000);
 }
//if clicked same card twice
//star should display correctly
//Timer should start when player starts a game
//add responsiveness
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
 let startSec = 0;
 let totalSec = 0;
 let startMin = 0;
 let elapsedString = " ";
 let x = setInterval(function(){
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
   if (totalSec > 300) {
     clearInterval(x);
     timer.innerHTML = '00:00';
     //Display modal game over.
   }
 }, 1000);
