import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export default class AuthController {
  static showLoginForm(req, res) {
    res.render('auth/login', { title: 'Login' });
  }

  static async loginUser(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash('error_msg', 'Por favor, preencha todos os campos.');
      return res.redirect('/auth/login');
    }

    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        req.flash('error_msg', 'Email não registrado.');
        return res.redirect('/auth/login');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        req.flash('error_msg', 'Senha incorreta.');
        return res.redirect('/auth/login');
      }

      req.session.user = { id: user.idUser, name: user.name, role: user.role };
      req.flash('success_msg', 'Login realizado com sucesso.');

      switch (user.role) {
        case 'Administrador':
          return res.redirect('/admin/dashboard');
        case 'Aluno':
          return res.redirect('/student/dashboard');
        case 'Monitor':
          return res.redirect('/tutor/dashboard');
        default:
          req.flash('error_msg', 'Tipo de usuário inválido.');
          return res.redirect('/auth/login');
      }
    } catch (error) {
      req.flash('error_msg', 'Erro ao realizar login.');
      res.redirect('/auth/login');
    }
  }

  static showRegisterForm(req, res) {
    res.render('auth/register', { title: 'Registrar Usuário' });
  }

  static async registerUser(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      req.flash('error_msg', 'Por favor, preencha todos os campos.');
      return res.redirect('/auth/register');
    }

    if (password !== confirmPassword) {
      req.flash('error_msg', 'As senhas não correspondem.');
      return res.redirect('/auth/register');
    }

    try {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        req.flash('error_msg', 'Email já registrado.');
        return res.redirect('/auth/register');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'Aluno',
      });

      req.flash('success_msg', 'Usuário registrado com sucesso.');
      res.redirect('/auth/login');
    } catch (error) {
      req.flash('error_msg', 'Erro ao registrar o usuário.');
      res.redirect('/auth/register');
    }
  }

  static async logoutUser(req, res) {
    req.flash('success_msg', 'Logout realizado com sucesso.');
    req.session.destroy((err) => {
      if (err) {
        req.flash('error_msg', 'Erro ao fazer logout.');
        return res.redirect('/');
      }
      res.redirect('/auth/login');
    });
  }
}
