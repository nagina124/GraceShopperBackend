const client = require('./client')
const {createUser, createProduct, getAllUsers} = require("./index");
const { addProductToOrder } = require('./orders');
const { getAllProducts } = require('./products');
async function dropTables() {
    console.log("dropping tables");
    try {
        await client.query(`
            DROP TABLE IF EXISTS reviews;
            DROP TABLE IF EXISTS orders;
            DROP TABLE IF EXISTS products;
            DROP TABLE IF EXISTS users;
        `)
        console.log("finished dropping tables")
    } catch (error) {
        console.log("error dropping tables");
        throw error;
    }
}

async function createTables() {
    try {
        await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        );
        
        CREATE TABLE products (
            id SERIAL PRIMARY KEY,
            category VARCHAR(255) UNIQUE NOT NULL,
            title VARCHAR(255) UNIQUE NOT NULL,
            description TEXT NOT NULL,
            price FLOAT NOT NULL,
            inventory INTEGER
        );

        CREATE TABLE orders (
            id SERIAL PRIMARY KEY,
            "userId" INTEGER REFERENCES users(id),
            "productId" INTEGER REFERENCES products(id),
            "productTitle" VARCHAR(255) REFERENCES products(title),
            count INTEGER NOT NULL, 
            UNIQUE ("userId", "productId")
        );
        
        CREATE TABLE reviews (
            id SERIAL PRIMARY KEY,
            "userId" INTEGER REFERENCES users(id),
            "productId" INTEGER REFERENCES products(id),
            review TEXT NOT NULL
        );
        `);

    } catch (error) {
        console.log("error building tables")
        throw error;
    }
}


//SEED DATA

async function createInitialUsers() {
    console.log('Starting to create users...');
    try {
  
      const usersToCreate = [
        { username: 'cloud', password: 'blondehair', email: 'cloud@graceshopper.com' },
        { username: 'zelda', password: 'link', email: 'zelda@graceshopper.com' },
        { username: 'mario', password: 'luigi', email: 'mario@graceshopper.com' },
      ]
      const users = await Promise.all(usersToCreate.map(createUser));
  
      console.log('Users created:');
      console.log(users);
      console.log('Finished creating users!');
    } catch (error) {
      console.error('Error creating users!');
      throw error;
    }
  }

async function createInitialProducts() {
    try {
        console.log("starting to create products")
        const productsToCreate = [
            { category: 'JRPG', title: 'Final Fantasty VII', description: 'save the world' , price: 59.99, inventory: 10 },
            { category: 'Action/Adventure', title: 'The Last Of Us Part II', description: 'get revenge' , price: 59.99, inventory: 15 },
            { category: 'RPG', title: 'The Witcher III', description: 'kill monsters' , price: 39.99, inventory: 5 },
            { category: 'Fighting', title: 'Street Fighter V', description: 'beat people up' , price: 19.99, inventory: 7 },
            { category: 'Horror', title: 'Resident Evil Village', description: 'run from monsters' , price: 59.99, inventory: 20 },
        ]

        const products = await Promise.all(productsToCreate.map(createProduct));

        console.log('products created:');
        console.log(products);
    
        console.log('Finished creating products!');

    } catch (error) {
        console.error('error creating products')
        throw error;
    }
}


async function createInitialOrders() {
    try {
        console.log("starting to create orders")
        const [
            cloud,
            zelda,
            mario
        ] = await getAllUsers();
        const [
                finalFantasyVII,
                lastOfUsPartII,
                theWitcherIII,
                streetFighterV,
                residentEvilVillage
        ] = await getAllProducts();
        
        const ordersToCreate = [
            {
                userId: cloud.id,
                productId: finalFantasyVII.id,
                productTitle: finalFantasyVII.title,
                count: 2
            },
            {
                userId: zelda.id,
                productId: lastOfUsPartII.id,
                productTitle: lastOfUsPartII.title,
                count: 1
            },
            {
                userId: mario.id,
                productId: theWitcherIII.id,
                productTitle: theWitcherIII.title,
                count: 3
            },
            {
                userId: mario.id,
                productId: streetFighterV.id,
                productTitle: streetFighterV.title,
                count: 1
            },
            {
                userId: cloud.id,
                productId: residentEvilVillage.id,
                productTitle: residentEvilVillage.title,
                count: 2
            }
        ];

        const ordersCreated = await Promise.all(ordersToCreate.map(addProductToOrder))
        console.log("orders created: ", ordersCreated);
        console.log("Finished creating orders!");

    } catch (error) {
        console.log("error creating orders")
        throw error;
    }
}

// async function createInitialReviews() {
//     try {

//     } catch (error) {
//         console.log("error creating reviews")
//         throw error;
//     }
// }


async function rebuildDB() {
    try {
      client.connect();
      await dropTables();
      await createTables();
      await createInitialUsers();
      await createInitialProducts();
      await createInitialOrders();
    //   await createInitialReviews();
    } catch (error) {
      console.log('Error during rebuildDB')
      throw error;
    }
  }
  
  module.exports = {
    rebuildDB
  };