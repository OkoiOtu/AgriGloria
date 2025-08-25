const panels = document.querySelectorAll('.panel');
const cardsContainer = document.querySelector('.ex-cards');
const leftArrow = document.querySelector('.arrow.left');
const rightArrow = document.querySelector('.arrow.right');

let scrollStep = 200;

panels.forEach(panel => {
  panel.addEventListener('click', () => {
    removeActiveClasses();
    panel.classList.add('active'); 

    panel.scrollIntoView({ 
      behavior: "smooth", 
      inline: "center", 
      block: "nearest"
    });
  });
});
 
function removeActiveClasses() {
  panels.forEach(panel => panel.classList.remove('active'));
}

// Scroll arrows
rightArrow.addEventListener('click', () => {
  cardsContainer.scrollBy({ left: scrollStep, behavior: "smooth" });
});

leftArrow.addEventListener('click', () => {
  cardsContainer.scrollBy({ left: -scrollStep, behavior: "smooth" });
});

let currentIndex = 0;

function showCard(index) {
  removeActiveClasses();
  panels[index].classList.add("active");
  panels[index].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  currentIndex = index;
}

rightArrow.addEventListener("click", () => {
  if (window.innerWidth <= 1000) {
    // Mobile full screen slide
    currentIndex = (currentIndex + 1) % panels.length;
    showCard(currentIndex);
  } else {
    // Desktop scroll
    cardsContainer.scrollBy({ left: scrollStep, behavior: "smooth" });
  }
});

leftArrow.addEventListener("click", () => {
  if (window.innerWidth <= 1000) {
    // Mobile full screen slide
    currentIndex = (currentIndex - 1 + panels.length) % panels.length;
    showCard(currentIndex);
  } else {
    // Desktop scroll
    cardsContainer.scrollBy({ left: -scrollStep, behavior: "smooth" });
  }
});

