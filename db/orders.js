const client = require('./client');
const { getProductById } = require('./products')


async function createOrder ({productId, productTitle, count}) {
    try {
        const {rows: [order]} = await client.query(`
            INSERT into orders("productId", "productTitle", count)
            VALUES($1, $2, $3)
            RETURNING *;
        `, [productId, productTitle, count])
        order.products = []
        return order;
    } catch (error) {
        throw (error) 
    }
}


async function deleteProductFromOrder (id) {
    try {
        const { rows } = await client.query(`
            DELETE FROM orders
            WHERE "productId"=$1
            RETURNING *;
        `, [id])
        return rows;
    } catch (error) {
        throw (error)
    }
}


async function deleteOrder (id) {
    try {
         await client.query(`
            DELETE FROM orders
            WHERE "productId"=$1;
        `, [id])
        
        const { rows } = await client.query(`
            DELETE FROM orders
            WHERE id=$1
            RETURNING *;
        `, [id])

    } catch (error) {
        throw (error)
    }
}

// async function updateOrder ({ id, title, price, count }) {
//     const {rows: [order] } = await client.query(`
//         UPDATE orders
//         SET title=$2, price=$3, count=$4
//         WHERE id=$1
//         RETURNING *;
//     `, [id, title, price, count])
//     return order
// }

//need to figure out how to address userId and guest checkout
//figure out how to make orders into an array 
async function addProductToOrder ({ userId, productId, productTitle, count, orderComplete }) {
    console.log(productId, "line 64")
    const product = await getProductById(productId)
    console.log(product, "line 65")
    try {
        const {rows: [order] } = await client.query(`
            INSERT INTO orders( "userId", "productId", "productTitle", count, "orderComplete")
            VALUES($1, $2, $3, $4, $5)
            RETURNING *;
        `, [userId, productId, productTitle, count, orderComplete])

        // console.log(order.products, "line 76")
        // order.products.push(product)

        return order;
    } catch (error) {
        throw error;
    }
}

async function getOrderById (id) {
    try {
        const {rows: [order]} = await client.query(`
            SELECT * 
            FROM orders 
            WHERE id=$1;
        `, [id])
        return order;
    } catch (error) {
        throw error;
    }
}

async function getAllOrders() {
    try {
      const {rows} = await client.query(`
        SELECT * FROM orders;
      `)
      return rows;
    } catch (error) {
        throw error
    }
  }


async function increaseCountOfProduct (productTitle) {
    try {
        const { rows: [product] } = await client.query(`
            SELECT *
            FROM orders 
            WHERE "productTitle"=$1;
        `, [productTitle])

        const newCount = product.count + 1 

         
        const { rows: [order] } = await client.query(`
            UPDATE orders 
            SET count= $2
            WHERE "productTitle"=$1
            RETURNING*;
        `, [productTitle, newCount])

      return order;

    } catch (error) {
        throw (error)
    }
}


module.exports = {
    createOrder,
    deleteProductFromOrder,
    deleteOrder,
    // updateOrder,
    addProductToOrder,
    getOrderById, 
    getAllOrders,
    increaseCountOfProduct
}