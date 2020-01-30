const Turn = require('../src/Turn');
const Card = require('./Card');
const Deck = require('./Deck');
const data = require('./data');
const prototypeQuestions = data.prototypeData;

class Round {
  constructor(deck) {
    this.deck = deck;
    this.turns = 0;
    this.incorrectGuesses = [];
    this.gameStartTime = new Date();
    this.gameEndTime = null;
  }

  returnCurrentCard() {
    return this.deck.cards[this.turns];
  }

  takeTurn(guess) {
    let currentTurn = new Turn(guess, this.deck.cards[this.turns]);
    if (currentTurn.giveFeedback() !== 'correct!') {
      this.incorrectGuesses.push(this.deck.cards[this.turns].id);
    }
    this.turns++;
    return currentTurn.giveFeedback();
  }

  calculatePercentCorrect() {
    let numberOfCorrectAnswers = this.turns - this.incorrectGuesses.length;
    return (numberOfCorrectAnswers / this.turns) * 100;
  }

  endRound() {
    let response = `** Round over! ** You answered ${this.calculatePercentCorrect()}% of the answers correctly!`;
    this.gameEndTime = new Date();
    let timeDiff = (this.gameEndTime - this.gameStartTime) / 1000;
    let minutes = Math.floor((timeDiff / 60) % 60);
    timeDiff -= minutes * 60;
    let seconds = Math.floor(timeDiff % 60);
    console.log(response);
    console.log(`This round took you ${minutes} minutes and ${seconds} seconds to complete.`);
    return response;
  }

  startMissedRound() {
    this.turns = 0;
    let missedCards = this.incorrectGuesses.map(id => {
      id = prototypeQuestions[id - 1];
      return id;
    });
    this.deck = new Deck(missedCards);
    this.incorrectGuesses = [];
  }
}

module.exports = Round;
