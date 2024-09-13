module.exports = {
  content: [
    './views/**/*.handlebars', // Monitorar todos os arquivos Handlebars na pasta views
    './public/**/*.html', // Monitorar qualquer arquivo HTML na pasta public
    './public/**/*.js', // Monitorar qualquer arquivo JS na pasta public
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
