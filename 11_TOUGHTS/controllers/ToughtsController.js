import Tought from '../models/Tought.js';
import User from '../models/User.js';

export default class ToughtsController {
  static async showToughts(req, res) {
    try {
      const toughtsData = await Tought.findAll({ include: User });

      const toughts = toughtsData.map(result => result.get({ plain: true }));

      res.render('toughts/home', { toughts });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }

  static async dashboard(req, res) {
    try {
      const userid = req.session.userid;

      const user = await User.findOne({
        where: { id: userid },
        include: Tought,
        plain: true,
      });

      if (!user) {
        res.redirect('/login');
      }
      const toughts = user.Toughts.map(result => result.dataValues);

      let emptyToughts = false;

      if (toughts.length === 0) {
        emptyToughts = true;
      }
      //console.log(user.Toughts);
      console.log(toughts);

      res.render('toughts/dashboard', { toughts, emptyToughts });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }

  static async createTought(req, res) {
    res.render('toughts/create');
  }

  static async createToughtSave(req, res) {
    const tought = {
      title: req.body.title,
      UserId: req.session.userid,
    };

    try {
      await Tought.create(tought);

      req.flash('message', 'Pensamento criado com sucesso!');

      req.session.save(() => {
        res.redirect('/toughts/dashboard');
      });
    } catch (error) {
      console.log('Aconteceu um erro: ' + error);
    }
  }

  static async removeTought(req, res) {
    const id = req.body.id;
    const UserId = req.session.userid;

    try {
      await Tought.destroy({ where: { id: id, UserId: UserId } });
      req.flash('message', 'Pensamento removido com sucesso!');

      req.session.save(() => {
        res.redirect('/toughts/dashboard');
      });
    } catch (error) {}
  }

  static async updateTought(req, res) {
    const id = req.params.id;

    const tought = await Tought.findOne({ where: { id: id }, raw: true });

    res.render('toughts/edit', { tought });
  }

  static async updateToughtSave(req, res) {
    const { id, title } = req.body;

    try {
      await Tought.update(
        { title: title },
        {
          where: {
            id: id,
          },
        }
      );

      req.flash('message', 'Pensamento atualizado com sucesso!');

      req.session.save(() => {
        res.redirect('/toughts/dashboard');
      });
    } catch (error) {
      console.log(error);
    }
  }
}
