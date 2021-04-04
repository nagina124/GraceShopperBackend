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
            productURL VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
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
    const users = await Promise.all(
      usersToCreate.map((user) => createUser(user))
    );

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
        title: "Final Fantasy VII Remake",
        productURL: "final-fantasy-vii-remake",
        description:
          "The world has fallen under the control of the Shinra Electric Power Company, a shadowy corporation controlling the planet’s very life force as mako energy. In the sprawling city of Midgar, an anti-Shinra organization calling themselves Avalanche have stepped up their resistance. Cloud Strife, a former member of Shinra’s elite SOLDIER unit now turned mercenary, lends his aid to the group, unaware of the epic consequences that await him. The story of this first, standalone game in the FINAL FANTASY VII REMAKE project covers up to the party’s escape from Midgar, and goes deeper into the events occurring in Midgar than the original FINAL FANTASY VII.",
        price: 59.99,
        inventory: 10,
      },
      {
        category: "Action-Adventure",
        title: "The Last Of Us Part II",
        productURL: "the-last-of-us-part-ii",
        description:
          "Five years after their dangerous journey across the post-pandemic United States, Ellie and Joel have settled down in Jackson, Wyoming. Living amongst a thriving community of survivors has allowed them peace and stability, despite the constant threat of the infected and other, more desperate survivors. When a violent event disrupts that peace, Ellie embarks on a relentless journey to carry out justice and find closure. As she hunts those responsible one by one, she is confronted with the devastating physical and emotional repercussions of her actions.",
        price: 59.99,
        inventory: 15,
      },
      {
        category: "RPG",
        title: "The Witcher 3: Wild Hunt",
        productURL: "the-witcher-3-wild-hunt",
        description:
          "In a war-torn world, with the Wild Hunt on your back, you'll take on your most important contract -- to track down the child of prophecy, a key and a weapon which can save or destroy all.",
        price: 39.99,
        inventory: 5,
      },
      {
        category: "Fighting",
        title: "Street Fighter V: Championship Edition",
        productURL: "street-fighter-v-championship-edition",
        description:
          "Rule the ring with Street Fighter V: Champion Edition, the most robust version of the acclaimed fighting game! Choose from 40 diverse fighters, 34 dynamic stages and over 200 stylish costumes as you fight your way through a variety of exciting single-player and multi-player modes. READY? FIGHT!",
        price: 19.99,
        inventory: 7,
      },
      {
        category: "Horror",
        title: "Resident Evil Village",
        productURL: "resident-evil-village",
        description:
          "The next generation of survival horror rises in the form of Resident Evil Village, the eighth major entry in the Resident Evil series. With ultra-realistic graphics powered by the RE Engine, fight for survival as danger lurks around every corner. Set a few years after the horrifying events in the critically acclaimed Resident Evil 7 biohazard, the all-new storyline begins with Ethan Winters and his wife Mia living peacefully in a new location, free from their past nightmares. Just as they are building their new life together, tragedy befalls them once again. When BSAA captain Chris Redfield attacks their home, Ethan must once again head into hell to get his kidnapped daughter back.",
        price: 59.99,
        inventory: 20,
      },
      {
        category: "Simulation",
        title: "The Sims 4",
        productURL: "the-sims-4",
        description:
          "Unleash your imagination and create a unique world of Sims that’s an expression of you! Explore and customize every detail from Sims to homes, and much more. Choose how Sims look, act, and dress, then decide how they’ll live out each day. Design and build incredible homes for every family, then decorate with your favorite furnishings and décor. Travel to different neighborhoods where you can meet other Sims and learn about their lives. Discover beautiful locations with distinctive environments and go on spontaneous adventures. Manage the ups and downs of Sims’ everyday lives and see what happens when you play out scenarios from your own real life! Tell your stories your way while developing relationships, pursuing careers and life aspirations, and immersing yourself in this extraordinary game, where the possibilities are endless. Play with life!",
        price: 39.99,
        inventory: 55,
      },
      {
        category: "Simulation",
        title: "Animal Crossing: New Horizons",
        productURL: "animal-crossing-new-horizons",
        description:
          "Escape to a deserted island and create your own paradise as you explore, create, and customize in the Animal Crossing: New Horizons game. Your island getaway has a wealth of natural resources that can be used to craft everything from tools to creature comforts. You can hunt down insects at the crack of dawn, decorate your paradise throughout the day, or enjoy sunset on the beach while fishing in the ocean. The time of day and season match real life, so each day on your island is a chance to check in and find new surprises all year round. Get ready to make a splash in your own island paradise.",
        price: 59.99,
        inventory: 25,
      },
      {
        category: "Action-Adventure",
        title: "Spider-Man: Miles Morales",
        productURL: "spider-man-miles-morales",
        description:
          "Be greater. Be yourself. Experience the rise of Miles Morales as the new hero masters incredible, explosive new powers to become his own Spider-Man. In the latest adventure in the Marvel’s Spider-Man universe, teenager Miles Morales is adjusting to his new home while following in the footsteps of his mentor, Peter Parker, as a new Spider-Man. But when a fierce power struggle threatens to destroy his new home, the aspiring hero realizes that with great power, there must also come great responsibility. To save all of Marvel’s New York, Miles must take up the mantle of Spider-Man and own it.",
        price: 49.99,
        inventory: 200,
      },
      {
        category: "JRPG",
        title: "Persona 5",
        productURL: "persona-5",
        description:
          "RPG fans rejoice! Uncover the picaresque story of a young team of phantom thieves in this latest addition to the critically acclaimed Persona series. By day, enjoy your high school life in the big city, spending your time however you please. The bonds you form with the people you meet will grow into a great power to help you fulfill your destiny! After school, use your Metaverse Navigator smartphone app to infiltrate Palaces--surreal worlds created from the hearts of corrupt adults--and slip away to your double life as a phantom thief. With the power of Persona, make these criminals have a change of heart by stealing the Treasure of their distorted desires. Join your new friends in the fight to reform society with your own sense of justice!",
        price: 19.99,
        inventory: 30,
      },
      {
        category: "Hack-N-Slash",
        title: "Devil May Cry 5",
        productURL: "devil-may-cry-5",
        description:
          "The ultimate Devil Hunter is back in style, in the game action fans have been waiting for. A brand new entry in the legendary action series, Devil May Cry 5 brings together its signature blend of high-octane action and otherworldly original characters with the latest Capcom gaming technology to deliver a graphically groundbreaking action-adventure masterpiece.",
        price: 19.99,
        inventory: 25,
      },
      {
        category: "RPG",
        title: "Yakuza: Like A Dragon",
        productURL: "yakuza-like-a-dragon",
        description:
          "Ichiban Kasuga, a low-ranking grunt of a low-ranking yakuza family in Tokyo, faces an 18-year prison sentence after taking the fall for a crime he didn't commit. Never losing faith, he loyally serves his time and returns to society to discover that no one was waiting for him on the outside, and his clan has been destroyed by the man he respected most. Confused and alone, he embarks on a mission to discover the truth behind his family's betrayal and take his life back, becoming an unlikely hero for the city’s outcasts on his journey. Experience dynamic RPG combat like none other. Switch between 19 unique Jobs ranging from Bodyguard to Musician, and use the battlefield your weapon. Take up bats, umbrellas, bikes, street signs, and everything else at your disposal to crack some skulls!",
        price: 49.99,
        inventory: 220,
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
      theSims4,
      animalCrossingNewHorizons, 
      spiderManMilesMorales,
      personaV,
      devilMayCry5,
      yakuzaDragon
    ] = await getAllProducts();

    const ordersToCreate = [
      {
        userId: cloud.id,
        productId: finalFantasyVII.id,
        productTitle: finalFantasyVII.title,
        count: 2,
        orderComplete: false,
      },
      {
        userId: zelda.id,
        productId: lastOfUsPartII.id,
        productTitle: lastOfUsPartII.title,
        count: 1,
        orderComplete: false,
      },
      {
        userId: mario.id,
        productId: theWitcherIII.id,
        productTitle: theWitcherIII.title,
        count: 3,
        orderComplete: false,
      },
      {
        userId: mario.id,
        productId: streetFighterV.id,
        productTitle: streetFighterV.title,
        count: 1,
        orderComplete: false,
      },
      {
        userId: cloud.id,
        productId: residentEvilVillage.id,
        productTitle: residentEvilVillage.title,
        count: 2,
        orderComplete: true,
      },
      {
        userId: cloud.id,
        productId: theSims4.id,
        productTitle: theSims4.title,
        count: 4,
        orderComplete: false,
      },
      {
        userId: cloud.id,
        productId: animalCrossingNewHorizons.id,
        productTitle: animalCrossingNewHorizons.title,
        count: 1,
        orderComplete: false,
      },
      {
        userId: mario.id,
        productId: spiderManMilesMorales.id,
        productTitle: spiderManMilesMorales.title,
        count: 1,
        orderComplete: false,
      },
      {
        userId: zelda.id,
        productId: personaV.id,
        productTitle: personaV.title,
        count: 3,
        orderComplete: false,
      },
      {
        userId: zelda.id,
        productId: devilMayCry5.id,
        productTitle: devilMayCry5.title,
        count: 1,
        orderComplete: false,
      },
      {
        userId: cloud.id,
        productId: yakuzaDragon.id,
        productTitle: yakuzaDragon.title,
        count: 5,
        orderComplete: false,
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
