import { quizQuestions } from './quiz-data';
import { getProducts } from './api';
import type { Product } from './types';
import { showLoader } from '../utils/show-loader';
import { showError } from '../utils/show-error';

let currentQuestion = 0;
let totalScore = 0;

const quizContent = document.getElementById('coffee-quiz') as HTMLElement;

function renderQuestion(): void {
  const question = quizQuestions[currentQuestion];
  quizContent.innerHTML = `
      <h3 class="quiz__content-title">${question.text}</h3>
      <div class="quiz__options">
        ${question.options
          .map(
            (opt) => `
          <button class="quiz__option" data-weight="${opt.weight}">
            ${opt.text}
          </button>
        `
          )
          .join('')}
      </div>
  `;

  document.querySelectorAll<HTMLButtonElement>('.quiz__option').forEach((btn) => {
    btn.addEventListener('click', () => handleAnswer(Number(btn.dataset.weight)));
  });
}

function handleAnswer(weight: number): void {
  totalScore += weight;
  currentQuestion++;

  if (currentQuestion < quizQuestions.length) {
    renderQuestion();
  } else {
    showResult();
  }
}

function getCategory(): 'coffee' | 'tea' {
  return totalScore >= 27 ? 'coffee' : 'tea';
}

async function showResult(): Promise<void> {
  const category = getCategory();
  showLoader(quizContent);

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const products: Product[] = await getProducts(category);
    const randomProduct = products[Math.floor(Math.random() * products.length)];

    quizContent.innerHTML = `
      <div class="quiz__result">
        <h2>Your perfect ${category} match is:</h2>
        <img 
          src="${`/img/products/${randomProduct.category}/${randomProduct.id}.jpg`}" 
          alt="${randomProduct.name}" 
          class="quiz__result-img" 
        />
        <h3 class="quiz__result-name">${randomProduct.name}</h3>
        <p class="quiz__result-descr">${randomProduct.description}</p>
        <button class="button button-secondary" id="restart-quiz">Try again</button>
      </div>
    `;

    document.getElementById('restart-quiz')?.addEventListener('click', restartQuiz);
  } catch (error) {
    showError(quizContent);
    console.error(error);
  }
}

function restartQuiz(): void {
  currentQuestion = 0;
  totalScore = 0;
  renderQuestion();
}

document.addEventListener('DOMContentLoaded', renderQuestion);
