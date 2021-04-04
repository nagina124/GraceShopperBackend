const client = require("./client");

async function getProductById(id) {
  try {
    const {rows: [product]} = await client.query(`
      SELECT * FROM products 
      WHERE id=$1;
    `, [id]);
    return product;
  } catch (error) {
      throw error
  }
};

async function getAllProducts() {
  try {
    const {rows} = await client.query(`
      SELECT * FROM products;
    `)
    return rows;
  } catch (error) {
      throw error
  }
}

async function getProductsByCategory(category) {
  try {
    const { rows } = await client.query(`
      SELECT * FROM products 
      WHERE category=$1;
  `, [category]);
  return rows;
} catch (error) {
    throw error
}
}

async function createProduct({
  category,
  title,
  productURL,
  description,
  price,
  inventory,
  imageURL,
  splash,
}) {
  try {
    const {
      rows: [product],
    } = await client.query(
      `
      INSERT INTO products(category, title, "productURL", description, price, inventory, "imageURL", splash)
      VALUES($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `,
      [category, title, productURL, description, price, inventory, imageURL, splash]
    );
    return product;
  } catch (error) {
    throw error;
  }
}

async function updateProduct({ id, category, title, productURL, description, price, inventory, imageURL, splash }) {
  const fields = {
    category: category,
    title: title,
    productURL: productURL,
    description: description,
    price: price,
    inventory: inventory,
    imageURL: imageURL,
    splash: splash
  }

  if (category === undefined || category === null) delete fields.category;
  if (title === undefined || title === null) delete fields.title;
  if (productURL === undefined || productURL === null) delete fields.productURL;
  if (description === undefined || description === null) delete fields.description;
  if (price === undefined || price === null) delete fields.price;
  if (inventory === undefined || inventory === null) delete fields.inventory;
  if (imageURL === undefined || imageURL === null) delete fields.imageURL;
  if (splash === undefined || splash === null) delete fields.splash;

  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  try {
    const {rows: [products]} = await client.query(`
      UPDATE products
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
      `, Object.values(fields));
    return products;
  } catch (error) {
      throw error; 
  }
}

async function deleteProduct(id) {
  try {
    const {rows: [product]} = await client.query(`
      DELETE FROM products
      WHERE id=$1
      RETURNING *;
      `, [id]);
    return product;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getProductById,
  getAllProducts,
  createProduct,
  getProductsByCategory,
  updateProduct,
  deleteProduct
}