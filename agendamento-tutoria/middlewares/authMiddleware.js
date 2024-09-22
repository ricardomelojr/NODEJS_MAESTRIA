// Função auxiliar para redirecionar o usuário com base no seu papel (role)
const redirectToDashboard = (role, res) => {
  if (role === 'Aluno') {
    return res.redirect('/aluno/dashboard');
  } else if (role === 'Monitor') {
    return res.redirect('/tutor/dashboard');
  } else if (role === 'Administrador') {
    return res.redirect('/admin/dashboard');
  }
};

// Função para verificar se o usuário está autenticado
const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    req.flash(
      'error_msg',
      'Você precisa estar logado para acessar esta página.'
    );
    return res.redirect('/');
  }
  next();
};

// Middleware para garantir que o usuário é um Aluno
export const ensureAluno = (req, res, next) => {
  if (req.session.user.role === 'Aluno') {
    return next(); // Permite o acesso para Aluno
  }
  return redirectToDashboard(req.session.user.role, res); // Redireciona se não for Aluno
};

// Middleware para garantir que o usuário é um Monitor
export const ensureMonitor = (req, res, next) => {
  if (req.session.user.role === 'Monitor') {
    return next(); // Permite o acesso para Monitor
  }
  return redirectToDashboard(req.session.user.role, res); // Redireciona se não for Monitor
};

// Middleware para garantir que o usuário é um Administrador
export const ensureAdmin = (req, res, next) => {
  if (req.session.user.role === 'Administrador') {
    return next(); // Permite o acesso para Administrador
  }
  return redirectToDashboard(req.session.user.role, res); // Redireciona se não for Administrador
};

// Middleware geral para verificar se o usuário está autenticado
export const ensureAuthenticated = isAuthenticated;
