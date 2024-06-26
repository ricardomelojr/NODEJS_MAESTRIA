import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export default class AuthController {
  static async login(req, res) {
    res.render('auth/login');
  }

  static async register(req, res) {
    res.render('auth/register');
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    // Validar se as senhas são iguais
    if (password !== confirmpassword) {
      req.flash('message', 'As senhas não conferem, tente novamente!');
      return res.render('auth/register');
    }

    try {
      // Verificar se o usuário já existe
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        req.flash('message', 'O e-mail já está em uso!');
        return res.render('auth/register');
      }

      // Criar senha criptografada
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Criar novo usuário
      const user = {
        name,
        email,
        password: hashedPassword,
      };

      const createUser = await User.create(user);

      // Initialize session
      req.session.userid = createUser.id;

      req.flash('message', 'Cadastro realizado com sucesso!');
      req.session.save(() => {
        res.redirect('/');
      });
    } catch (error) {
      console.error(error);
      req.flash(
        'message',
        'Erro ao realizar o cadastro. Tente novamente mais tarde.'
      );
      res.render('auth/register');
    }
  }

  static async logout(req, res) {
    req.session.destroy();
    res.redirect('/login');
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      req.flash('message', 'Usuário não encontrado');
      res.render('auth/login');

      return;
    }

    // check is passwords match
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      req.flash('message', 'Senha incorreta!');
      res.render('auth/login');

      return;
    }

    req.session.userid = user.id;

    req.flash('message', 'Login realizado com sucesso!');

    req.session.save(() => {
      res.redirect('/');
    });
  }
}
