let users = [];
let results = [];
let ageArray = [];
let femaleCount = 0;
let maleCount = 0;
let inputString = "";

const inputElement = document.querySelector("#input-busca");
const resultElement = document.querySelector("#results-list");
const statsElement = document.querySelector("#stats-id");
const numberOfUsers = document.querySelector("#numberOfUsers");
const resultForm = document.querySelector("#results");
const textStats = document.querySelector("#textStats");

window.addEventListener("load", async () => {
  fetchUsers();
  inputMonitor();
});

async function fetchUsers() {
  const usersFetched = await fetch(
    "https://www.randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo"
  );
  const allusers = await usersFetched.json();

  users = allusers.results.map((user) => {
    const { name, picture, dob, gender } = user;
    const completeName = name.first + " " + name.last;

    return {
      completeName,
      picture,
      dob,
      gender,
    };
  });
}

function inputMonitor() {
  inputElement.addEventListener("keyup", function (event) {
    inputString = event.target.value;

    filterUsers();
    validateInput();
  });
}

function validateInput() {
  if (inputString.length !== 0 && results.length > 0) {
    displayUsers();
  } else {
    resultElement.innerHTML = "";
    numberOfUsers.textContent = "Nenhum usuário filtrado";
    statsElement.innerHTML = "";
    textStats.textContent = "Nada a ser exibido";
  }
}

function filterUsers() {
  results = users.filter((user) =>
    user.completeName.toLowerCase().includes(inputString.toLowerCase())
  );
}

function displayUsers() {
  ageArray = [];
  maleCount = 0;
  femaleCount = 0;

  let htmlUsers = "<div>";

  results.forEach((user) => {
    const { completeName, picture, dob, gender } = user;
    const userhtml = `
    <li class="user">
      <img src="${picture.thumbnail}"
      <p>${completeName}, ${dob.age}</p>
    </li>
    `;

    htmlUsers += userhtml;

    includeAgeArray(dob.age);
    countGenders(gender);
  });

  htmlUsers += "</div>";
  resultElement.innerHTML = htmlUsers;
  displayStats();
}

function countGenders(gender) {
  if (gender == "female") {
    femaleCount++;
  } else if (gender == "male") {
    maleCount++;
  }
}

function includeAgeArray(age) {
  ageArray = [...ageArray, age];
}

function displayStats() {
  const sum = ageArray.reduce((acc, curr) => acc + curr, 0);
  const med = sum / ageArray.length;
  const med2digits = parseFloat(med.toFixed(2));

  let htmlstats = "<div>";
  const stathtml = `
    <div>Sexo masculino: ${maleCount}</div>
    <div>Sexo feminino: ${femaleCount}</div>
    <div>Soma das idades: ${sum}</div>
    <div>Média das idades: ${med2digits}</div> 
  `;

  htmlstats += stathtml + "</div>";
  statsElement.innerHTML = htmlstats;

  numberOfUsers.textContent = `${results.length} Usuário(s) Encontrado(s)`;
  textStats.textContent = `Estatísticas: `;
}