import bcrypt from 'bcryptjs';
import User from '../models/User.js'; // Importa o model de usuário

export default class AuthController {
  // Exibe o formulário de registro
  static async register(req, res) {
    res.render('register', { title: 'Registrar-se' });
  }

  // Processa o formulário de registro
  static async registerPost(req, res) {
    // Extrai os dados do corpo da requisição
    const { name, email, password, confirmPassword } = req.body;

    // Validação básica dos campos
    if (!name || !email || !password || !confirmPassword) {
      req.flash('error_msg', 'Todos os campos são obrigatórios.');
      return res.redirect('/register');
    }

    // Verificar se as senhas são iguais
    if (password !== confirmPassword) {
      req.flash('error_msg', 'As senhas não coincidem.');
      return res.redirect('/register');
    }

    // Verifica se a senha tem o tamanho adequado
    if (password.length < 6) {
      req.flash('error_msg', 'A senha deve ter pelo menos 6 caracteres.');
      return res.redirect('/register');
    }

    try {
      // Verifica se o email já está registrado no banco de dados
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        req.flash('error_msg', 'O email já está registrado.');
        return res.redirect('/register');
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
      res.redirect('/register');
    }
  }
}
