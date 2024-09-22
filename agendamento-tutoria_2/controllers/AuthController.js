import bcrypt from 'bcryptjs';
import User from '../models/User.js'; // Ajuste o caminho conforme necessário

// Exibir o formulário de registro
export const showRegisterForm = (req, res) => {
  res.render('auth/register', { title: 'Registrar Usuário' });
};

// Processar o registro de um novo usuário
export const registerUser = async (req, res) => {
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
      req.flash('error_msg', 'Email já registrado');
      return res.redirect('/auth/register');
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar novo usuário no banco de dados com 'role' padrão como 'Estudante'
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'Estudante', // Definido como 'Estudante' por padrão
    });

    req.flash('success_msg', 'Usuário registrado com sucesso');
    res.redirect('/auth/login');
  } catch (error) {
    req.flash('error_msg', 'Erro ao registrar o usuário');
    res.redirect('/auth/register');
  }
};
