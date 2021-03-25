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
    const {rows: [product]} = await client.query(`
      SELECT * FROM products 
      WHERE category=$1;
  `, [category]);
  return product;
} catch (error) {
    throw error
}
}

async function createProduct({category, title, description, price, inventory}) {
  try {
    const { rows: [product] } = await client.query(`
      INSERT INTO products(category, title, description, price, inventory)
      VALUES($1, $2, $3, $4, $5)
      RETURNING *;
    `, [category, title, description, price, inventory])
    return product;
  } catch (error) {
      throw error;
  }
}

async function updateProduct({ id, category, title, description, price, inventory }) {
  const fields = { category: category, title: title, description: description, price: price, inventory: inventory }
  if (category === undefined || category === null) delete fields.category;
  if (title === undefined || title === null) delete fields.title;
  if (description === undefined || description === null) delete fields.description;
  if (price === undefined || price === null) delete fields.price;
  if (inventory === undefined || inventory === null) delete fields.inventory;

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

async function deleteProducts(id) {
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
  deleteProducts
}