function sortearNumeros() {
  const numeros = [];
  while (numeros.length < 6) {
    const numero = Math.floor(Math.random() * 60) + 1;
    if (!numeros.includes(numero)) {
      numeros.push(numero);
    }
  }
  numeros.sort((a, b) => a - b); // Opcional: ordenar os números
  document.getElementById('numbers').innerText = numeros.join(', ');
}
