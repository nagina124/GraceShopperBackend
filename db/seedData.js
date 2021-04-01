const client = require("./client");
const { createUser, createProduct, getAllUsers } = require("./index");
const { addProductToOrder } = require("./orders");
const { getAllProducts } = require("./products");
async function dropTables() {
  console.log("dropping tables");
  try {
    await client.query(`
            DROP TABLE IF EXISTS reviews;
            DROP TABLE IF EXISTS orders;
            DROP TABLE IF EXISTS products;
            DROP TABLE IF EXISTS users;
        `);
    console.log("finished dropping tables");
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
            password VARCHAR(255) NOT NULL,
            "isAdmin" BOOLEAN DEFAULT FALSE
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
            "orderComplete" BOOLEAN DEFAULT FALSE,
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
    console.log("error building tables");
    throw error;
  }
}

//SEED DATA

async function createInitialUsers() {
  console.log("Starting to create users...");
  try {
    const usersToCreate = [
      {
        username: "cloud",
        password: "blondehair",
        email: "cloud@graceshopper.com",
        isAdmin: false,
      },
      {
        username: "zelda",
        password: "link",
        email: "zelda@graceshopper.com",
        isAdmin: false,
      },
      {
        username: "mario",
        password: "luigi",
        email: "mario@graceshopper.com",
        isAdmin: false,
      },
      {
        username: "isabelle",
        password: "adminlyfe",
        email: "admin@graceshopper.com",
        isAdmin: true,
      },
    ];
    const users = await Promise.all(usersToCreate.map((user) => createUser(user)));

    console.log("Users created:");
    console.log(users);
    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function createInitialProducts() {
  try {
    console.log("starting to create products");
    const productsToCreate = [
      {
        category: "JRPG",
        title: "Final Fantasty VII Remake",
        description: "The world has fallen under the control of the Shinra Electric Power Company, a shadowy corporation controlling the planet’s very life force as mako energy. In the sprawling city of Midgar, an anti-Shinra organization calling themselves Avalanche have stepped up their resistance. Cloud Strife, a former member of Shinra’s elite SOLDIER unit now turned mercenary, lends his aid to the group, unaware of the epic consequences that await him. The story of this first, standalone game in the FINAL FANTASY VII REMAKE project covers up to the party’s escape from Midgar, and goes deeper into the events occurring in Midgar than the original FINAL FANTASY VII.",
        price: 59.99,
        inventory: 10,
      },
      {
        category: "Action-Adventure",
        title: "The Last Of Us Part II",
        description: "Five years after their dangerous journey across the post-pandemic United States, Ellie and Joel have settled down in Jackson, Wyoming. Living amongst a thriving community of survivors has allowed them peace and stability, despite the constant threat of the infected and other, more desperate survivors. When a violent event disrupts that peace, Ellie embarks on a relentless journey to carry out justice and find closure. As she hunts those responsible one by one, she is confronted with the devastating physical and emotional repercussions of her actions.",
        price: 59.99,
        inventory: 15,
      },
      {
        category: "RPG",
        title: "The Witcher 3: Wild Hunt",
        description: "In a war-torn world, with the Wild Hunt on your back, you'll take on your most important contract -- to track down the child of prophecy, a key and a weapon which can save or destroy all.",
        price: 39.99,
        inventory: 5,
      },
      {
        category: "Fighting",
        title: "Street Fighter V: Championship Edition",
        description: "Rule the ring with Street Fighter V: Champion Edition, the most robust version of the acclaimed fighting game! Choose from 40 diverse fighters, 34 dynamic stages and over 200 stylish costumes as you fight your way through a variety of exciting single-player and multi-player modes. READY? FIGHT!",
        price: 19.99,
        inventory: 7,
      },
      {
        category: "Horror",
        title: "Resident Evil Village",
        description: "The next generation of survival horror rises in the form of Resident Evil Village, the eighth major entry in the Resident Evil series. With ultra-realistic graphics powered by the RE Engine, fight for survival as danger lurks around every corner. Set a few years after the horrifying events in the critically acclaimed Resident Evil 7 biohazard, the all-new storyline begins with Ethan Winters and his wife Mia living peacefully in a new location, free from their past nightmares. Just as they are building their new life together, tragedy befalls them once again. When BSAA captain Chris Redfield attacks their home, Ethan must once again head into hell to get his kidnapped daughter back.",
        price: 59.99,
        inventory: 20,
      },
    ];

    const products = await Promise.all(productsToCreate.map(createProduct));

    console.log("products created:");
    console.log(products);

    console.log("Finished creating products!");
  } catch (error) {
    console.error("error creating products");
    throw error;
  }
}

async function createInitialOrders() {
  try {
    console.log("starting to create orders");
    const [cloud, zelda, mario] = await getAllUsers();
    const [
      finalFantasyVII,
      lastOfUsPartII,
      theWitcherIII,
      streetFighterV,
      residentEvilVillage,
    ] = await getAllProducts();

    const ordersToCreate = [
      {
        userId: cloud.id,
        productId: finalFantasyVII.id,
        productTitle: finalFantasyVII.title,
        count: 2,
        orderComplete: false
      },
      {
        userId: zelda.id,
        productId: lastOfUsPartII.id,
        productTitle: lastOfUsPartII.title,
        count: 1,
        orderComplete: false
      },
      {
        userId: mario.id,
        productId: theWitcherIII.id,
        productTitle: theWitcherIII.title,
        count: 3,
        orderComplete: false
      },
      {
        userId: mario.id,
        productId: streetFighterV.id,
        productTitle: streetFighterV.title,
        count: 1,
        orderComplete: false
      },
      {
        userId: cloud.id,
        productId: residentEvilVillage.id,
        productTitle: residentEvilVillage.title,
        count: 2,
        orderComplete: true
      },
    ];

    const ordersCreated = await Promise.all(
      ordersToCreate.map(addProductToOrder)
    );
    console.log("orders created: ", ordersCreated);
    console.log("Finished creating orders!");
  } catch (error) {
    console.log("error creating orders");
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
    console.log("Error during rebuildDB");
    throw error;
  }
}

module.exports = {
  rebuildDB,
};
