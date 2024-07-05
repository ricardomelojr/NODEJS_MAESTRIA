const axios = require('axios');

const apiKey = 'sua_chave_da_api';
const city = 'São Paulo';
const url = `http://api.openweathermap.org/data/2.5/weather?q=${manaus}&appid=${apiKey}&units=metric`;

axios
  .get(url)
  .then(response => {
    const weatherData = response.data;
    console.log(`A temperatura atual em ${city} é ${weatherData.main.temp}°C`);
  })
  .catch(error => {
    console.error('Erro ao obter dados do clima:', error);
  });
