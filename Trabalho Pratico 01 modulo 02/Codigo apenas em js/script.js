const fs = require('fs');

const readFile = (filename) => fs.readFileSync(filename, "UTF-8");
const saveFile = (filename, content) => fs.writeFileSync(filename, content, "UTF-8")
const jsonToObject = (string) => JSON.parse(string);

const filterCityByState = (stateId, cities) => cities.filter(city => city.Estado === stateId);

const stateNumberOfCities = (uf) => jsonToObject(readFile(`${uf}.json`)).length;

const descCriteriaForNumbers = (a, b) => b.count - a.count;
const ascCriteriaForNumbers = (a, b) => a.count - b.count;

const ascCriteriaForLenght = (a, b) => {
  if (a.Nome.length < b.Nome.length) return -1;
  if (a.Nome.length > b.Nome.length) return 1;
  if (a.Nome.length == b.Nome.length) return a.Nome.localeCompare(b.Nome)
}

const descCriteriaForLength = (a, b) => {
  if (a.Nome.length < b.Nome.length) return 1;
  if (a.Nome.length > b.Nome.length) return -1;
  if (a.Nome.length == b.Nome.length) return a.Nome.localeCompare(b.Nome)
};

function statesToJSON(states, cities) {
  states.forEach(state => {
    const citiesOfState = filterCityByState(state.ID, cities);
    saveFile(`${state.Sigla}.json`, JSON.stringify(citiesOfState, null, 4));
  });
}

function filterStatesByNumbeOfCities(states, criteria) {

  const arrayWithNumberOfCities = states.map(state => ({ ...state, count: stateNumberOfCities(state.Sigla) }))
  const sortedArray = arrayWithNumberOfCities.sort(criteria);

  const result = sortedArray.slice(0, 5).map(state => `${state.Sigla} - ${state.count}`);

  return result;

}

function filterCityFromStateByLength(states, criteria) {

  const result = [];

  states.forEach(state => {
    const biggerCityName = jsonToObject(readFile(`${state.Sigla}.json`)).sort(criteria)[0];
    result.push(`${biggerCityName.Nome} - ${state.Sigla}`)
  })

  return result;
}

function filterTheMostCityFromAllStates(states, cities, criteria) {
  const nameOfCity = cities.map(city => ({ Nome: city.Nome, uf: city.Estado })).sort(criteria)[0];
  const UFOfCity = states.filter(state => state.ID === nameOfCity.uf)[0];

  return `${nameOfCity.Nome} - ${UFOfCity.Nome}`

}
(function main() {

  const states = jsonToObject(readFile("Estados.json"));
  const cities = jsonToObject(readFile("Cidades.json"));

  // Criar os 27 Json's
  statesToJSON(states, cities);

  // Devolve a quantidade de cidades de um estado pela UF

  const numberOfCitiesOfMG = stateNumberOfCities("MG");
  console.log(numberOfCitiesOfMG);

  //Filtrar os Top 5
  const topFiveStatesByDescNumberOfCities = filterStatesByNumbeOfCities(states, descCriteriaForNumbers);
  console.log(topFiveStatesByDescNumberOfCities);
  const topFiveStatesByAscNumberOfCities = filterStatesByNumbeOfCities(states, ascCriteriaForNumbers).reverse();
  console.log(topFiveStatesByAscNumberOfCities);


  // Filtrar o Top 5 por Letra

  const topCitiesByAscLenght = filterCityFromStateByLength(states, ascCriteriaForLenght);
  console.log(topCitiesByAscLenght);
  const topCitiesByDescLength = filterCityFromStateByLength(states, descCriteriaForLength);
  console.log(topCitiesByDescLength)

  // Filtrar as Maiores
  const biggestCity = filterTheMostCityFromAllStates(states, cities, ascCriteriaForLenght);
  console.log(biggestCity);
  const smallestCity = filterTheMostCityFromAllStates(states, cities, descCriteriaForLength);
  console.log(smallestCity)

})();