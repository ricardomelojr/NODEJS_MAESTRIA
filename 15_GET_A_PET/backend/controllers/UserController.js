// UserController.js
import createUserToken from '../helpers/create-user-token.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import getToken from '../helpers/get-token.js';
import jwt from 'jsonwebtoken';
import getUserByToken from '../helpers/get-user-by-token.js';

export default class UserController {
  /* REGISTRAR */
  static async register(req, res) {
    const { name, email, phone, password, confirmpassword } = req.body;

    // * Validações
    if (!name) {
      return res.status(422).json({ message: 'O nome é obrigatório' });
    }
    if (!email) {
      return res.status(422).json({ message: 'O email é obrigatório' });
    }
    if (!phone) {
      return res.status(422).json({ message: 'O telefone é obrigatório' });
    }
    if (!password) {
      return res.status(422).json({ message: 'A senha é obrigatória' });
    }
    if (password !== confirmpassword) {
      return res.status(422).json({ message: 'As senhas não conferem' });
    }

    /* create a password */
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Verificar se o usuário já existe
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(422).json({ message: 'Email já cadastrado' });
    }

    // Criar novo usuário
    const user = new User({
      name,
      email,
      phone,
      password: passwordHash,
    });

    try {
      const newUser = await user.save();

      await createUserToken(newUser, req, res);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar usuário', error });
    }
  }

  /* LOGAR */
  static async login(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(422).json({ message: 'O email é obrigatório' });
    }
    if (!password) {
      return res.status(422).json({ message: 'A senha é obrigatória' });
    }

    /*
     * Verificar se o usuário já existe
     */
    const user = await User.findOne({ email });

    if (!user) {
      res
        .status(422)
        .json({ message: 'Não há usuário cadastrado com este e-mail' });
      return;
    }

    /*
     * CHECK IF PASSWORD MATCH WITH DB PASSWORD
     */
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      res.status(422).json({ message: 'Senha inválida!' });
      return;
    }

    await createUserToken(user, req, res);
  }
  /*
   * CHECK USER
   */
  static async checkUser(req, res) {
    let currentUser = null;

    if (req.headers.authorization) {
      try {
        const token = getToken(req);

        const decoded = jwt.verify(token, 'nossosecret');

        currentUser = await User.findById(decoded.id);
        if (currentUser) {
          currentUser.password = undefined;
        }
      } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
      }
    }

    res.status(200).send(currentUser);
  }

  /*
   * GET USER BY ID
   */
  static async getUserById(req, res) {
    const id = req.params.id;

    const user = await User.findById(id).select('-password');
    if (!user) {
      res.status(422).json({ message: 'Usuário não encontrado!' });
      return;
    }

    res.status(200).json({ user });
  }

  /*
   * EDIT USER
   */
  static async editUser(req, res) {
    const id = req.params.id;

    // * CHECK IR USER EXISTS
    const token = await getToken(req);
    const user = await getUserByToken(token);

    const { name, email, phone, password, confirmpassword } = req.body;

    if (req.file) {
      user.image = req.file.filename;
    }

    //* VALIDATIONS
    if (!name) {
      return res.status(422).json({ message: 'O nome é obrigatório' });
    }
    if (!email) {
      return res.status(422).json({ message: 'O email é obrigatório' });
    }
    // * VERIFICAR SE O E-MAIL JÁ EXISTE
    const userExists = await User.findOne({ email: email });
    if (user.email !== email && userExists) {
      res.status(422).json({ message: 'Por favor utilize outro e-mail!' });
      return;
    }
    user.email = email;
    if (!phone) {
      return res.status(422).json({ message: 'O telefone é obrigatório' });
    }

    if (password !== confirmpassword) {
      return res.status(422).json({ message: 'As senhas não conferem' });
    } else if (password === confirmpassword && password != null) {
      // * create password
      /* create a password */
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      user.name = name;
      user.email = email;
      user.phone = phone;
      user.password = passwordHash;
    }

    try {
      // * retornar dados atualizados

      await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true }
      );
      res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
    } catch (err) {
      res.status(500).json({ message: err });
      return;
    }
  }
}
