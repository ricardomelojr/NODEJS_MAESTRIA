import User from '../models/User.js';

export default class UserController {
  static async exibirMonitores(req, res) {
    try {
      // Busca todos os usuários que possuem a role de 'Monitor'
      const monitoresData = await User.findAll({
        where: { role: 'Monitor' },
      });
      const monitores = monitoresData.map(result =>
        result.get({ plain: true })
      );
      // Renderiza a view 'monitores', passando a lista de monitores
      res.render('monitores', { monitores, customCSS: '/css/monitores.css' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
}
