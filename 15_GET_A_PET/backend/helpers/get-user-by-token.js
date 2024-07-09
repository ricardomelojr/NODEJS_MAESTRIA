import jwt from 'jsonwebtoken';

import User from '../models/User.js';

//* PEGAR USUÁRIO PELO TOKEN
const getUserByToken = async token => {
  const decoded = jwt.verify(token, 'nossosecret');
  const userId = decoded.id;
  const user = await User.findOne({ _id: userId });
  return user;
};

export default getUserByToken;
