// Importa o módulo http para criar um servidor web
const http = require('http');

// Importa o módulo fs (file system) para manipulação de arquivos
const fs = require('fs');

// Importa o módulo url para manipulação de URLs
const url = require('url');

// Define a porta em que o servidor irá ouvir
const port = 3000;

// Cria o servidor HTTP
const server = http.createServer((req, res) => {
  // Analisa a URL da requisição
  const q = url.parse(req.url, true);

  // Obtém o caminho do arquivo a partir da URL, removendo a barra inicial
  let fileName = q.pathname.substring(1);

  // Se não houver um caminho específico, define 'index.html' como padrão
  if (!fileName) {
    fileName = 'index.html';
  }

  // Verifica se o arquivo solicitado é um arquivo HTML
  if (fileName.endsWith('.html')) {
    // Verifica se o arquivo existe
    fs.exists(fileName, exists => {
      if (exists) {
        // Lê o conteúdo do arquivo
        fs.readFile(fileName, (err, data) => {
          if (err) {
            // Se ocorrer um erro ao ler o arquivo, responde com um erro 500
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.write('<h1>500 Internal Server Error</h1>');
            return res.end();
          }
          // Responde com o conteúdo do arquivo e um status 200 (OK)
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.write(data);
          return res.end();
        });
      } else {
        // Se o arquivo não existir, lê o conteúdo de '404.html'
        fs.readFile('404.html', (err, data) => {
          if (err) {
            // Se ocorrer um erro ao ler o arquivo '404.html', responde com um erro 404 simples
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.write('<h1>404 Not Found</h1>');
            return res.end();
          }
          // Responde com o conteúdo de '404.html' e um status 404 (Not Found)
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.write(data);
          return res.end();
        });
      }
    });
  } else {
    // Se o arquivo solicitado não for HTML, responde com um erro 400 (Bad Request)
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.write('<h1>400 Bad Request</h1>');
    return res.end();
  }
});

// Faz o servidor ouvir na porta definida
server.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`);
});
