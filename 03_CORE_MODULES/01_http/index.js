const http = require('http'); // Importa o módulo HTTP nativo do Node.js, que permite a criação de servidores web.

const port = 3000; // Define a porta na qual o servidor irá escutar. Nesse caso, a porta 3000.

const server = http.createServer((req, res) => {
  // Cria um servidor HTTP. A função callback é chamada toda vez que uma requisição é feita ao servidor.
  res.write('Oi HTTP'); // Escreve a string 'Oi HTTP' na resposta que será enviada ao cliente.
  res.end(); // Finaliza a resposta, indicando que todas as informações foram enviadas.
});

server.listen(port, () => {
  // Faz o servidor escutar na porta definida anteriormente (3000). A função callback é executada quando o servidor começa a escutar.
  console.log(`Servidor rodando na porta: ${port}`); // Imprime uma mensagem no console indicando que o servidor está rodando e especifica a porta.
});
