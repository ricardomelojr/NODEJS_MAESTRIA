export default class AlunoController {
  static async alunoDashboard(req, res) {
    res.render('aluno/dashboard', {
      title: 'Dashboard do Aluno',
      user: req.session.user, // Passa os dados do usuário logado
      role: 'Aluno', // Define o papel do usuário
    });
  }
}
