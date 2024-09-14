// Middleware para verificar se o usuário é um Aluno
export const ensureAluno = (req, res, next) => {
  if (!req.session.user) {
    // Se o usuário não estiver autenticado, redireciona para a Home
    req.flash(
      'error_msg',
      'Você precisa estar logado para acessar esta página.'
    );
    return res.redirect('/');
  }

  if (req.session.user.role === 'Aluno') {
    return next(); // O usuário é um Aluno, permite o acesso
  } else if (req.session.user.role === 'Monitor') {
    // Se o usuário for Monitor, redireciona para a rota de Monitor
    return res.redirect('/tutor/dashboard');
  } else if (req.session.user.role === 'Administrador') {
    // Se o usuário for Administrador, redireciona para a rota de Admin
    return res.redirect('/admin/dashboard');
  }
};

// Middleware para verificar se o usuário é um Monitor
export const ensureMonitor = (req, res, next) => {
  if (!req.session.user) {
    // Se o usuário não estiver autenticado, redireciona para a Home
    req.flash(
      'error_msg',
      'Você precisa estar logado para acessar esta página.'
    );
    return res.redirect('/');
  }

  if (req.session.user.role === 'Monitor') {
    return next(); // O usuário é um Monitor, permite o acesso
  } else if (req.session.user.role === 'Aluno') {
    // Se o usuário for Aluno, redireciona para a rota de Aluno
    return res.redirect('/aluno/dashboard');
  } else if (req.session.user.role === 'Administrador') {
    // Se o usuário for Administrador, redireciona para a rota de Admin
    return res.redirect('/admin/dashboard');
  }
};

// Middleware para verificar se o usuário é um Administrador
export const ensureAdmin = (req, res, next) => {
  if (!req.session.user) {
    // Se o usuário não estiver autenticado, redireciona para a Home
    req.flash(
      'error_msg',
      'Você precisa estar logado para acessar esta página.'
    );
    return res.redirect('/');
  }

  if (req.session.user.role === 'Administrador') {
    return next(); // O usuário é um Administrador, permite o acesso
  } else if (req.session.user.role === 'Aluno') {
    // Se o usuário for Aluno, redireciona para a rota de Aluno
    return res.redirect('/aluno/dashboard');
  } else if (req.session.user.role === 'Monitor') {
    // Se o usuário for Monitor, redireciona para a rota de Monitor
    return res.redirect('/tutor/dashboard');
  }
};

// Middleware para verificar se o usuário está autenticado
export const ensureAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next(); // O usuário está autenticado, permite o acesso
  } else {
    req.flash(
      'error_msg',
      'Você precisa estar logado para acessar esta página.'
    );
    return res.redirect('/'); // Redireciona para a Home (página de login)
  }
};
