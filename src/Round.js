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
    let response = `** Round over! ** You answered ${this.calculatePercentCorrect() || 100}% of the answers correctly!`;
    console.log(response);
    return response;
  }

  startMissedRound() {
    this.turns = 0;
    let missedCards = this.incorrectGuesses.map(id => {
      id = prototypeQuestions[id - 1];
      return id;
    });
    this.deck = new Deck(missedCards);
    this.incorrectGuesses = 0;
  }
}

module.exports = Round;
