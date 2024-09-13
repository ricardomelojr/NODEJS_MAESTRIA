import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';

// Cria o caminho absoluto para __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Configurar o motor de templates Handlebars
app.engine(
  'handlebars',
  engine({
    defaultLayout: 'main', // Definir o layout padrão
    layoutsDir: path.join(__dirname, 'src/views/layouts'), // Diretório dos layouts
    partialsDir: path.join(__dirname, 'src/views/partials'), // Diretório dos partials
  })
);
app.set('view engine', 'handlebars');

// Configurar diretório de views
app.set('views', path.join(__dirname, 'src/views'));

// Configurar o diretório de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Definir rotas
import indexRoutes from './src/routes/index.js';
app.use('/', indexRoutes);

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
