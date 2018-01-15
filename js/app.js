import Vue from './vue.esm.browser.js';
import shuffled from './shuffled.js';

// Hide Error Message
document.getElementById("incompatible-message").style.display = "none";
document.getElementById("app").style.display = "block";

const app = new Vue({
  el: '#app',

  async mounted() {
    const res = await fetch("data/quizzes.json");
    this.originalQuizzes = await res.json();
    this.changeView('title');
  },

  data() {
    return {
      view: '',
      currentQuizIndex: 0,
      quizzes: [],
      answers: new Map(),
    };
  },

  methods: {
    getShuffledQuizzes() {
      return shuffled(this.originalQuizzes).map(quiz => {
        return {
          ...quiz,
          choices: shuffled(quiz.choices),
        };
      });
    },

    changeView(name) {
      switch(name) {
        case 'quiz':
          this.currentQuizIndex = 0;
          this.answers.forEach((value, key) => this.answers.delete(key));
          this.quizzes = this.getShuffledQuizzes();
          break;
      }
      this.view = name;
    },

    answer(quizId, choiceId) {
      this.answers.set(quizId, choiceId);
      this.nextQuiz();
    },

    nextQuiz() {
      this.currentQuizIndex = this.currentQuizIndex + 1;
      if(this.currentQuizIndex >= this.quizzes.length) {
        this.currentQuizIndex = 0;
        this.changeView('result');
      }
    }
  },

  computed: {
    currentQuiz() {
      return this.quizzes[this.currentQuizIndex];
    },

    score() {
      return this.quizzes.reduce((score, quiz) => {
        const { correctChoices, id } = quiz;
        if(correctChoices.includes(this.answers.get(id))) {
          return score + 1;
        }
        return score;
      }, 0);
    },

    resultMessage() {
      return `${ this.quizzes.length }問中${ this.score }問でした！`;
    }
  }
});
