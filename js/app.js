/*
 * Create a list that holds all of your cards
 */

const cards = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o',
              'fa-anchor', 'fa-anchor', 'fa-bolt', 'fa-bolt',
              'fa-cube', 'fa-cube', 'fa-bomb', 'fa-bomb',
              'fa-leaf', 'fa-leaf', 'fa-bicycle', 'fa-bicycle'];
const timer = document.querySelector('.timer');
const gameDeck = document.querySelector('.deck');

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
    shuffle(cards);
    const cardHtml = cards.map(function getCardTemplate(card){
        return `<li class="card"><i class="fa ${card}"></i></li>`;
    });
    gameDeck.innerHTML = cardHtml.join(' ');
}
initGame();

let allCardList = document.querySelectorAll('.card');
const moves = document.querySelector('.moves');
const restart = document.querySelector('.fa-repeat');
const stars = document.querySelector('.stars');
const closeList = document.querySelectorAll('.close');
const modalList = document.querySelectorAll('.modal');
const winningTime = document.querySelector('.win-time');
const winningStars = document.querySelector('.win-stars');
let openCardList = [];
let numberOfCardMatchedPair = 0;
let numberOfMoves = 0;
let movesRequired = 10;
let seconds = 30;
let starNumber=stars.children.length -1;
let isWinner = false;
let isRestart = false;
let firstClick = false;
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
let gameFinish = false;
function addTimer(){
let x = setInterval(function(){
    if(isRestart){
        startSec = 0;
        totalSec = 0;
        startMin = 0;
        elapsedString = " ";
        numberOfCardMatchedPair = 0;
        movesRequired = 10;
        seconds = 30;
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
    if(startSec > 9){
        elapsedString = "0"+startMin+":"+startSec;
    }
    else{
        elapsedString = "0"+startMin+":"+"0"+startSec;
    }
    timer.innerHTML = elapsedString;
    if(isWinner){
        clearInterval(x);
        winningTime.innerHTML = elapsedString;
        winningStars.innerHTML = starNumber + 1;
    }
    if(totalSec > 90){
        clearInterval(x);
        if(!isWinner){
            modalList[1].classList.add('fail-box');
        }
        gameFinish = true;
    }
    if(totalSec >= seconds){
        updateStars();
    }
    }, 1000);
}

/*
 *  Add event listener for each card
 *   - If user clicks the card and if the card has classlist other than card or
       card shake, do nothing
 *   - Otherwise, increase the number of moves by 1, open the card and if there
       are two cards open, check if they are matched or unmatched.
 *   - If both card are match, keep the cards open and shake.
 *   - If both card are unmatched, flip back the card and shake.
 *   - Make the openCardList array as empty.
 *   - If all cards are matched, display a message with the final score
*/

allCardList.forEach(function(card){
    card.addEventListener('click', showCard);
});
function showCard(event){
    const isOpenShowClass = event.target.classList.value;
    if(firstClick === false){
        firstClick = true;
        addTimer();
    }

    if(isOpenShowClass === 'card'|| isOpenShowClass === 'card shake'){
        numberOfMoves++;
        moves.innerText = numberOfMoves;
        event.target.classList.add('open', 'show');
        checkMatchUnmatchedCard(event.target);
    }
}
function checkMatchUnmatchedCard(newCard){
    setTimeout(function checkMatchCard(){
        openCardList.push(newCard);
        openCardList.forEach(function(card){
            if(openCardList.length == 2){
                if(openCardList[0].children[0].className !== openCardList[1].children[0].className){
                    openCardList[0].classList.remove('open', 'show');
                    openCardList[1].classList.remove('open', 'show');
                }
                else{
                    openCardList[0].classList.add('match');
                    openCardList[1].classList.add('match');
                    numberOfCardMatchedPair++;
                    if(numberOfCardMatchedPair == 8){
                        modalList[0].classList.add('win-box');
                        isWinner = true;
                    }
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
    numberOfMoves = 0;
    firstClick = false;
    moves.innerText = numberOfMoves;
    while (gameDeck.hasChildNodes()) {
        gameDeck.removeChild(gameDeck.firstChild);
    }
    initGame();
    if(gameFinish === true || isWinner === true)
    {
        gameFinish = false;
        isWinner = false;
        starNumber++;
        addTimer();
    }
    allCardList = document.querySelectorAll('.card');
    allCardList.forEach(function(card){
        card.addEventListener('click', showCard);
    });
    openCardList = [];
    isRestart = true;
}

/*
*  Update the stars based on the time taken and number of moves.
*  - for each 30 seconds if there is less than 10 moves, decrease one star
*/

function updateStars(){
    if(numberOfMoves < movesRequired){
        stars.children[starNumber].firstChild.classList.remove('checked');
        starNumber--;
    }
    movesRequired += 10;
    seconds += 30;
}
