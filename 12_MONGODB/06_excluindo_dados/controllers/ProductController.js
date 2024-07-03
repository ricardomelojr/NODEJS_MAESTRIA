import Product from '../models/Product.js';

export default class ProductController {
  /* TODOS OS PRODUTOS */
  static async showProducts(req, res) {
    const products = await Product.getProducts();

    res.render('products/all', { products });
  }

  /* ACESSAR A PÁGINA PARA CADASTRAR PRODUTO */
  static async createProduct(req, res) {
    res.render('products/create');
  }

  /* SALVAR O PRODUTO DE FATO */
  static async createProductPost(req, res) {
    const name = req.body.name;
    const image = req.body.image;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product(name, image, price, description);

    product.save();

    res.redirect('/products');
  }
  /* PEGANDO PRODUTO ESPECÍFICO */
  static async getProduct(req, res) {
    const id = req.params.id;

    const product = await Product.getProductById(id);

    res.render('products/product', { product });
  }
  /* REMOVENDO PRODUTO ESPECÍFICO */
  static async removeProduct(req, res) {
    const id = req.params.id;

    await Product.removeProductById(id);

    res.redirect('/products');
  }
}
