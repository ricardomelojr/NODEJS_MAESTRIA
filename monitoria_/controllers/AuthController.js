import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export default class AuthController {
  static async login(req, res) {
    res.render('auth/login', { customCSS: '/css/login.css' });
  }

  static async register(req, res) {
    res.render('auth/register', { customCSS: '/css/register.css' });
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    // Validar se as senhas são iguais
    if (password !== confirmpassword) {
      req.flash('message', 'As senhas não conferem, tente novamente!');
      return res.render('auth/register', { customCSS: '/css/register.css' });
    }

    try {
      // Verificar se o usuário já existe
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        req.flash('message', 'O e-mail já está em uso!');
        return res.render('auth/register', { customCSS: '/css/register.css' });
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
      req.session.save(err => {
        if (err) {
          console.error(err);
          req.flash(
            'message',
            'Erro ao realizar o cadastro. Tente novamente mais tarde.'
          );
          return res.render('auth/register', {
            customCSS: '/css/register.css',
          });
        }
        res.redirect('/');
      });
    } catch (error) {
      console.error(error);
      req.flash(
        'message',
        'Erro ao realizar o cadastro. Tente novamente mais tarde.'
      );
      res.render('auth/register', { customCSS: '/css/register.css' });
    }
  }

  static async logout(req, res) {
    req.session.destroy(err => {
      if (err) {
        console.error('Erro ao destruir a sessão:', err);
        return res.redirect('/'); // Ou redirecione para uma página de erro
      }
      res.redirect('/login');
    });
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;

    try {
      // Encontrar usuário
      const user = await User.findOne({ where: { email } });

      if (!user) {
        req.flash('message', 'Usuário não encontrado');
        return res.render('auth/login', { customCSS: '/css/login.css' });
      }

      // Verificar se as senhas coincidem
      const passwordMatch = bcrypt.compareSync(password, user.password);
      if (!passwordMatch) {
        req.flash('message', 'Senha incorreta!');
        return res.render('auth/login', { customCSS: '/css/login.css' });
      }

      req.session.userid = user.id;

      req.flash('message', 'Login realizado com sucesso!');
      req.session.save(err => {
        if (err) {
          console.error('Erro ao salvar a sessão:', err);
          return res.redirect('/login'); // Ou redirecione para uma página de erro
        }
        res.redirect(user.role === 'Administrador' ? '/monitores' : '/');
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      req.flash(
        'message',
        'Erro ao realizar login. Tente novamente mais tarde.'
      );
      res.render('auth/login', { customCSS: '/css/login.css' });
    }
  }
}
