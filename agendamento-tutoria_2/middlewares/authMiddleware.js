// middlewares/authMiddleware.js

// Verifica se o usuário está logado
export function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    req.flash('error_msg', 'Por favor, faça login para acessar esta página.');
    return res.redirect('/auth/login');
  }
}

// Verifica se o usuário é Administrador
export function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'Administrador') {
    return next();
  } else {
    req.flash('error_msg', 'Acesso negado. Apenas administradores podem acessar esta área.');
    return res.redirect(getCorrectDashboard(req.session.user.role));
  }
}

// Verifica se o usuário é Estudante
export function isAluno(req, res, next) {
  if (req.session.user && req.session.user.role === 'Aluno') {
    return next();
  } else {
    req.flash('error_msg', 'Acesso negado. Apenas estudantes podem acessar esta área.');
    return res.redirect(getCorrectDashboard(req.session.user.role));
  }
}

// Verifica se o usuário é Tutor
export function isTutor(req, res, next) {
  if (req.session.user && req.session.user.role === 'Monitor') {
    return next();
  } else {
    req.flash('error_msg', 'Acesso negado. Apenas tutores podem acessar esta área.');
    return res.redirect(getCorrectDashboard(req.session.user.role));
  }
}

// Função auxiliar para redirecionar o usuário para o dashboard correto
function getCorrectDashboard(role) {
  switch (role) {
    case 'Administrador':
      return '/admin/dashboard';
    case 'Aluno':
      return '/student/dashboard';
    case 'Monitor':
      return '/tutor/dashboard';
    default:
      return '/auth/login';
  }
}
