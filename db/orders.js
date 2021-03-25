const client = require('./client');


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

async function updateOrder ({ id, title, price, count }) {
    const {rows: [order] } = await client.query(`
        UPDATE orders
        SET title=$2, price=$3, count=$4
        WHERE id=$1
        RETURNING *;
    `, [id, title, price, count])
    return order
}

async function addProductToOrder ({ userId, productId, productTitle, count }) {
    try {
        const {rows: [order] } = await client.query(`
            INSERT INTO orders("userId", "productId", "productTitle", count)
            VALUES($1, $2, $3, $4)
            RETURNING *;
        `, [userId, productId, productTitle, count])
        return order;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    deleteProductFromOrder,
    deleteOrder,
    updateOrder,
    addProductToOrder
}