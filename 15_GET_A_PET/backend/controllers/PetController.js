import Pet from '../models/Pet.js';

// * HELPERS
import getToken from '../helpers/get-token.js';
import getUserByToken from '../helpers/get-user-by-token.js';
import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId; //Ajuda a verificar se um _id é um ObjectId

export default class PetController {
  // * CREATE A PET
  static async create(req, res) {
    const { name, age, weight, color } = req.body;
    const images = req.files;
    const available = true;

    // * VALIDATIONS
    if (!name) {
      res.status(422).json({ message: 'O nome é obrigatório!' });
      return;
    }
    if (!age) {
      res.status(422).json({ message: 'A idade é obrigatória!' });
      return;
    }
    if (!weight) {
      res.status(422).json({ message: 'O peso é obrigatório!' });
      return;
    }
    if (!color) {
      res.status(422).json({ message: 'A cor é obrigatória!' });
      return;
    }
    if (!images || images.length === 0) {
      res.status(422).json({ message: 'A imagem é obrigatória!' });
      return;
    }

    // * GET PET OWNER
    const token = getToken(req);
    const user = await getUserByToken(token);

    // * CREATE A PET
    const pet = new Pet({
      name,
      age,
      weight,
      color,
      available,
      images: [],
      user: {
        _id: user._id,
        name: user.name,
        image: user.image,
        phone: user.phone,
      },
    });

    // * IMAGES PROCESSING
    images.forEach(image => {
      pet.images.push(image.filename);
    });

    try {
      const newPet = await pet.save();
      res.status(201).json({ message: 'Pet criado com sucesso!', newPet });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // * getAll
  static async getAll(req, res) {
    const pets = await Pet.find().sort('-createdAt');

    res.status(200).json({ pets: pets });
  }

  // * getAllUserPets
  static async getAllUserPets(req, res) {
    // * GET USER FROM TOKEN
    const token = await getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({ 'user._id': user._id }).sort('-createdAt');

    res.status(200).json({ pets });
  }

  // * getAllUserAdoptions
  static async getAllUserAdoptions(req, res) {
    const token = await getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({ 'adopter._id': user._id }).sort('-createdAt');
    res.status(200).json({ pets });
  }
  // * getPetById
  static async getPetById(req, res) {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: 'ID inválido' });
      return;
    }
    // * CHECK IF PET EXISTS
    const pet = await Pet.findOne({ _id: id });
    if (!pet) {
      res.status(404).json({ message: `Pet não encontrado` });
    }

    res.status(200).json({ pet });
  }

  //* removePetById
  static async removePetById(req, res) {
    const id = req.params.id;
    // * CHECAR SE O ID É VÁLIDO
    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: 'ID inválido' });
      return;
    }
    // * CHECK IF PET EXISTS
    const pet = await Pet.findOne({ _id: id });
    if (!pet) {
      res.status(404).json({ message: `Pet não encontrado` });
    }

    // * CHECAR SE O USUÁRIO LOGADO REGISTROU O PET
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.toString() !== user._id.toString()) {
      res.status(422).json({
        message: `Houve um problema em processar a sua solicitação, tente novamente mais tarde!`,
      });
    }

    await Pet.findByIdAndDelete(id);

    res.status(200).json({ message: 'Pet removido com sucesso!' });
  }
}
