import './main';

const citiesWithStreets: Record<string, string[]> = {
  city1: [
    'Dluga',
    'Mariacka',
    'Targowa',
    'Grunwaldzka',
    'Waly Jagiellonskie',
    'Hucisko',
    'Garncarska',
    'Rajska',
    'Chlebnicka',
    'Piwna',
  ],
  city2: [
    'Marszalkowska',
    'Nowy Swiat',
    'Krolewska',
    'Swietokrzyska',
    'Kasztanowa',
    'Malczewskiego',
    'Zielona',
    'Lipowa',
    'Jasna',
    'Cicha',
  ],
  city3: [
    'Stary Rynek',
    'Wroclawska',
    'Polna',
    'Sikorskiego',
    'Kosciuszki',
    'Ogrodowa',
    'Sadowa',
    'Krucza',
    'Mickiewicza',
    'Kwiatowa',
  ],
};

const citySelect = document.getElementById('city') as HTMLSelectElement;
const streetSelect = document.getElementById('street') as HTMLSelectElement;

function updateStreets(city: string): void {
  streetSelect.innerHTML = `<option value="">Placeholder</option>`;

  if (city && citiesWithStreets[city]) {
    citiesWithStreets[city].forEach((street, i) => {
      const option = document.createElement('option');
      option.value = `street${i + 1}`;
      option.textContent = street;
      streetSelect.appendChild(option);
    });
  }
}

citySelect.addEventListener('change', () => {
  const selectedCity = citySelect.value;
  updateStreets(selectedCity);
});
