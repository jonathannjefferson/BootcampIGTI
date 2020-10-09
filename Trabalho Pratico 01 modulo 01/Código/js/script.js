window.addEventListener('load', start);
var rangesGlobal = document.querySelectorAll('.inputRange');
var resultadoGlobal = document.querySelector('#resultado');
var rgbGlobal = {};
function start() {
  for (var i = 0; i < rangesGlobal.length; i++) {
    carregaValorInput(i);
  }
  mudaRange();
  carregaCor();
}

function carregaValorInput(index) {
  var rangeAtual = rangesGlobal[index].value;
  var textAtual = document.querySelectorAll('.inputText')[index];
  textAtual.value = rangeAtual;
  rgbGlobal[index] = rangeAtual;
}

function mudaRange() {
  function alteraRange(event) {
    var idRange = event.target.id;
    if (idRange === 'inputR') {
      carregaValorInput(0);
    } else if (idRange === 'inputG') {
      carregaValorInput(1);
    } else {
      carregaValorInput(2);
    }
    carregaCor();
  }

  for (var i = 0; i < rangesGlobal.length; i++) {
    rangesGlobal[i].addEventListener('input', alteraRange);
  }
}
function carregaCor() {
  resultadoGlobal.style.backgroundColor =
    'rgb(' + rgbGlobal[0] + ',' + rgbGlobal[1] + ',' + rgbGlobal[2] + ')';
}
