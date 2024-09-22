import bcrypt from 'bcryptjs';
import User from '../models/User.js'; // Importa o model de usuário

export default class AuthController {
  // Exibe o formulário de registro
  static async register(req, res) {
    res.render('auth/register', { title: 'Registrar-se' });
  }

  // Processa o formulário de registro
  static async registerPost(req, res) {
    // Extrai os dados do corpo da requisição
    const { name, email, password, confirmPassword } = req.body;

    // Validação básica dos campos
    if (!name || !email || !password || !confirmPassword) {
      req.flash('error_msg', 'Todos os campos são obrigatórios.');
      return res.redirect('/auth/register');
    }

    // Verificar se as senhas são iguais
    if (password !== confirmPassword) {
      req.flash('error_msg', 'As senhas não coincidem.');
      return res.redirect('/auth/register');
    }

    // Verifica se a senha tem o tamanho adequado
    if (password.length < 6) {
      req.flash('error_msg', 'A senha deve ter pelo menos 6 caracteres.');
      return res.redirect('/auth/register');
    }

    try {
      // Verifica se o email já está registrado no banco de dados
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        req.flash('error_msg', 'O email já está registrado.');
        return res.redirect('/auth/register');
      }

      // Criptografa a senha antes de salvar
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Cria o novo usuário no banco de dados
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'Aluno', // Define o papel padrão como "Aluno"
      });

      // Salva o usuário na sessão (login automático)
      req.session.user = {
        id: newUser.id,
        name: newUser.name,
        role: newUser.role,
      };

      // Redireciona o usuário para a rota de Aluno com uma mensagem de sucesso
      req.flash(
        'success_msg',
        'Cadastro realizado com sucesso! Bem-vindo ao sistema.'
      );
      res.redirect('/aluno/dashboard'); // Redireciona para a página de aluno
    } catch (error) {
      console.error('Erro ao registrar o usuário:', error);
      req.flash('error_msg', 'Erro no servidor. Tente novamente mais tarde.');
      res.redirect('/auth/register');
    }
  }

  // Exibe o formulário de login
  static async login(req, res) {
    res.render('auth/login', { title: 'Login' });
  }

  // Processa o formulário de login
  static async loginPost(req, res) {
    const { email, password } = req.body;

    // Validação básica dos campos
    if (!email || !password) {
      req.flash('error_msg', 'Todos os campos são obrigatórios.');
      return res.redirect('/auth/login');
    }

    try {
      // Verifica se o email existe no banco de dados
      const user = await User.findOne({ where: { email } });
      if (!user) {
        req.flash('error_msg', 'Credenciais inválidas.');
        return res.redirect('/auth/login');
      }

      // Verifica a senha
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        req.flash('error_msg', 'Credenciais inválidas.');
        return res.redirect('/auth/login');
      }

      // Salva o usuário na sessão
      req.session.user = {
        id: user.id,
        name: user.name,
        role: user.role,
      };

      // Redireciona o usuário para a página correta com base no papel (role)
      if (user.role === 'Aluno') {
        req.flash('success_msg', 'Login realizado com sucesso!');
        return res.redirect('/aluno/dashboard');
      } else if (user.role === 'Monitor') {
        req.flash('success_msg', 'Login realizado com sucesso!');
        return res.redirect('/tutor/dashboard');
      } else if (user.role === 'Administrador') {
        req.flash('success_msg', 'Login realizado com sucesso!');
        return res.redirect('/admin/dashboard');
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      req.flash('error_msg', 'Erro no servidor. Tente novamente mais tarde.');
      res.redirect('/auth/login');
    }
  }

  // Logout
  static logout(req, res) {
    req.session.destroy(err => {
      if (err) {
        console.error('Erro ao fazer logout:', err);
        return res.redirect('/');
      }
      res.redirect('/');
    });
  }
}
