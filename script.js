const filters = [
    'invert(1)',
    'grayscale(1)',
    'sepia(1)',
    'blur(5px)',
    'contrast(2)',
    'brightness(2)',
    'saturate(2)',
    'hue-rotate(90deg)'
];
  
function getRandomFilter() {
  const randomIndex = Math.floor(Math.random() * filters.length);
  return filters[randomIndex];
}
  
function applyRandomFilter() {
  const container = document.querySelector('#container');
  
  const stylesheet = document.styleSheets[0];

  for (let rule of stylesheet.cssRules) {
    if (rule.selectorText === '#container::before') {
      const randomFilter = getRandomFilter();
      rule.style.filter = randomFilter;

      setTimeout(() => {
        rule.style.filter = 'none';
      }, 1000);

      break;
    }
  }
}
  
setInterval(() => {
  applyRandomFilter();
}, 5000);
  
document.getElementById('getIpButton').addEventListener('click', () => {
  fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        alert(`${data.ip} 🙊`);
      })
      .catch(error => console.error('Wystąpił błąd:', error));
});


const titles = [
  "404 Dreams Found",
  "Underworld Connection Established",
  "Cyber Abyss Awaits",
  "The Void is Watching",
  "Error: Hope Not Found",
  "Ping to the Underworld: 666ms",
];

function changeTitle() {
  const randomIndex1 = Math.floor(Math.random() * titles.length);
  document.title = titles[randomIndex1];
}

setInterval(changeTitle, 3000);


