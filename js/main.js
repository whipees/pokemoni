let detailedPokemonList = [];

async function loadPokemonList() {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000');
  const data = await response.json();
  const dropdown = document.getElementById('pokemonDropdown');

  const detailPromises = data.results.map(p => fetch(p.url).then(res => res.json()));
  detailedPokemonList = await Promise.all(detailPromises);

  detailedPokemonList.forEach(pokemon => {
    const option = document.createElement('option');
    option.value = pokemon.name;
    option.textContent = pokemon.name;
    dropdown.appendChild(option);
  });

  dropdown.addEventListener('change', (e) => {
    const name = e.target.value;
    const details = detailedPokemonList.find(p => p.name === name);
    displayPokemonDetails(details);
  });
}

function displayPokemonDetails(pokemon) {
  if (!pokemon) return;
  const container = document.getElementById('pokemonDetails');
  container.innerHTML = `
    <h3>${pokemon.name}</h3>
    <p><strong>Výška:</strong> ${pokemon.height}</p>
    <p><strong>Váha:</strong> ${pokemon.weight}</p>
    <p><strong>Schopnosti:</strong> ${pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="pokemon-img">
  `;
}

function searchPokemon() {
  const nameFilter = document.getElementById('nameInput').value.toLowerCase();
  const minHeight = parseInt(document.getElementById('minHeight').value) || 0;
  const minWeight = parseInt(document.getElementById('minWeight').value) || 0;

  const results = detailedPokemonList.filter(p =>
    p.name.includes(nameFilter) &&
    p.height >= minHeight &&
    p.weight >= minWeight
  );

  displaySearchResults(results);
}

function displaySearchResults(results) {
  const container = document.getElementById('searchResults');
  if (results.length === 0) {
    container.innerHTML = '<p>Žádné výsledky.</p>';
    return;
  }

  let html = '<table><tr><th>Obrázek</th><th>Jméno</th><th>Výška</th><th>Váha</th></tr>';
  results.forEach(p => {
    html += `<tr>
      <td><img src="${p.sprites.front_default}" alt="${p.name}" class="pokemon-img"></td>
      <td>${p.name}</td>
      <td>${p.height}</td>
      <td>${p.weight}</td>
    </tr>`;
  });
  html += '</table>';

  container.innerHTML = html;
}

loadPokemonList();