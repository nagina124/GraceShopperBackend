const express = require("express");
const usersRouter = express.Router();
const jwt = require("jsonwebtoken");
const {
  getUserByUsername,
  createUser,
  getUser,
  getAllUsers,
  deleteUser,
  updateUser,
} = require("../db/users");
const { requireUser } = require("./utils");

usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next();
});

usersRouter.get("/", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.send({
      users,
    });
  } catch (error) {
    console.log(error);
  }
});

usersRouter.post("/register", async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      next({
        name: "UserExistsError",
        message: "A user by that username already exists",
      });
    } else {
      const user = await createUser({
        username,
        email,
        password,
        isAdmin: false,
      });

      console.log(user);
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );

      res.send({
        message: "thank you for signing up",
        token,
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  console.log(req.user, "line73");

  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username/email and password",
    });
  }

  try {
    const user = await getUser({ username, password });

    if (user && password) {
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );

      res.send({
        message: "you're logged in!",
        token: token,
        admin: user.isAdmin,
        userId: user.id,
      });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
      return;
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

usersRouter.get("/me", async (req, res, next) => {
  // const authHeader = req.header("Authorization");
  console.log(authHeader, "line 117");
  try {
    // if (authHeader) {
    res.send(req.user);
    // } else {
    //   res.status(401);
    //   next({
    //     name: "Invalid Token",
    //     message: "Unauthorized user",
    //   });
    // }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

usersRouter.patch("/:userId", async (req, res, next) => {
  const { userId } = req.params;
  const { email, username, password, isAdmin } = req.body;

  try {
    const updatedUser = await updateUser({
      id: userId,
      email,
      username,
      password,
      isAdmin,
    });
    res.send(updatedUser);
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/:userId", async (req, res, next) => {
  // const { id } = req.admin; //**
  const { userId } = req.params;
  try {
    const deletedUser = await deleteUser(userId);
    res.send(deletedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
