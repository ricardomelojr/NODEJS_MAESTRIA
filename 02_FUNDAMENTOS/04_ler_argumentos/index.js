/* Informar no console para testar: 
   node .\index.js nome="Ricardo" 
   */
console.log(process.argv);

const args = process.argv.slice(2);

console.log('args: ', args);

const nome = args[0].split('=')[1];
console.log(nome);

const idade = args[1].split('=')[1];
console.log(idade);

console.log(`O nome dele é ${nome} e tem ${idade} anos`);
