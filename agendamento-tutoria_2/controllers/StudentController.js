export default class StudentController {
  // Exibir o dashboard do aluno
  static dashboard(req, res) {
    try {
      res.render('student/dashboard', {
        title: 'Dashboard do Aluno',
        user: req.session.user, // Informações do usuário logado
        layout: 'main', // Usando o layout principal (ajuste conforme seu layout)
      });
    } catch (error) {
      console.error('Erro ao carregar o dashboard do aluno:', error);
      req.flash('error_msg', 'Erro ao carregar o dashboard.');
      res.redirect('/');
    }
  }
}
