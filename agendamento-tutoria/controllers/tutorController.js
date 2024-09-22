export default class TutorController {
  static async tutorDashboard(req, res) {
    res.render('tutor/dashboard', {
      title: 'Dashboard do Tutor',
      user: req.session.user, // Passa os dados do usuário logado
      role: 'Monitor', // Define o papel do usuário como Monitor
    });
  }
}
