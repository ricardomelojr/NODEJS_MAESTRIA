import bcrypt from 'bcryptjs';
import User from '../models/User.js'; // Ajuste o caminho conforme necessário

export default class AuthController {
  // Exibir o formulário de login
  static showLoginForm(req, res) {
    res.render('auth/login', { title: 'Login' });
  }

  // Processar o login do usuário
  static async loginUser(req, res) {
    const { email, password } = req.body;

    // Verificar se os campos estão preenchidos
    if (!email || !password) {
      req.flash('error_msg', 'Por favor, preencha todos os campos.');
      return res.redirect('/auth/login');
    }

    try {
      // Verificar se o usuário existe
      const user = await User.findOne({ where: { email } });
      if (!user) {
        req.flash('error_msg', 'Email não registrado.');
        return res.redirect('/auth/login');
      }

      // Verificar se a senha está correta
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        req.flash('error_msg', 'Senha incorreta.');
        return res.redirect('/auth/login');
      }

      // Autenticar o usuário e armazenar na sessão
      req.session.user = { id: user.idUser, name: user.name, role: user.role };
      req.flash('success_msg', 'Login realizado com sucesso.');

      // Redirecionar o usuário com base no seu papel (role)
      switch (user.role) {
        case 'Administrador':
          return res.redirect('/admin/dashboard');
        case 'Aluno':
          return res.redirect('/student/dashboard');
        case 'Tutor':
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

  // Exibir o formulário de registro
  static showRegisterForm(req, res) {
    res.render('auth/register', { title: 'Registrar Usuário' });
  }

  // Processar o registro de um novo usuário
  static async registerUser(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    // Verificar se todos os campos estão preenchidos
    if (!name || !email || !password || !confirmPassword) {
      req.flash('error_msg', 'Por favor, preencha todos os campos.');
      return res.redirect('/auth/register');
    }

    // Verificar se as senhas são iguais
    if (password !== confirmPassword) {
      req.flash('error_msg', 'As senhas não correspondem.');
      return res.redirect('/auth/register');
    }

    try {
      // Verificar se o email já existe
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        req.flash('error_msg', 'Email já registrado.');
        return res.redirect('/auth/register');
      }

      // Criptografar a senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar o novo usuário
      await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'Aluno', // Definido como 'Estudante' por padrão
      });

      req.flash('success_msg', 'Usuário registrado com sucesso.');
      res.redirect('/auth/login');
    } catch (error) {
      req.flash('error_msg', 'Erro ao registrar o usuário.');
      res.redirect('/auth/register');
    }
  }

  // Desconectar o usuário
  static async logoutUser(req, res) {
    req.flash('success_msg', 'Logout realizado com sucesso.');
    req.session.destroy(err => {
      if (err) {
        req.flash('error_msg', 'Erro ao fazer logout.');
        return res.redirect('/');
      }

      res.redirect('/auth/login');
    });
  }
}
