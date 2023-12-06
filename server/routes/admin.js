const express = require("express");
const router = express.Router();
const posts = require("../models/model");
const users = require("../models/user");
const adminLayout = "../views/layouts/admin";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtsecret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);

  if (!token) {
    return res.status(401).json({
      message: "Failed",
    });
  } else {
    try {
      const decoded = jwt.verify(token, jwtsecret);
      req.userid = decoded.userid;
      next();
    } catch (e) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
  }
};

// home route
router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Blog site example",
    };
    res.render("admin/index", { locals, layout: adminLayout });
  } catch (e) {
    console.log(e);
  }
});

//admin registration
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashpass = await bcrypt.hash(password, 10);

    try {
      const userCreate = await users.create({
        username,
        password: hashpass,
      });
      console.log(userCreate);
      res.send({ userCreate });
      res.status(201).json({
        message: "User Created",
        userCreate,
      });
    } catch (e) {
      if (e.code === 1100) {
        res.status(401).json({
          message: "User already in use",
        });
      }
      res.status(500).json({
        message: "internal server error",
      });
    }
    // res.render("admin/index", { locals, layout: adminLayout });
  } catch (e) {
    console.log(e);
  }
});

// check admin login
router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await users.findOne({ username });
    console.log(user);
    if (!user) res.send("Invalid Credentals");

    const validpass = await bcrypt.compare(password, user.password);
    if (!validpass) res.send("Invalid Credentals");

    const token = jwt.sign({ userid: user.id }, jwtsecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");

    // res.render("admin/index", { locals, layout: adminLayout });
  } catch (e) {
    console.log(e);
  }
});

//admin dashboard

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Blog site",
      description: "Blog site example",
    };
    const data = await posts.findAll();
    res.render("admin/dashboard", { locals, data, layout: adminLayout });
  } catch (e) {
    console.log(e);
  }
});

//add post form
router.get("/add-post", authMiddleware, async (req, res) => {
  res.render("admin/addpost", { layout: adminLayout });
});

//create post
router.post("/add-post", authMiddleware, async (req, res) => {
  try {
    const { title, body } = req.body;
    await posts.create({
      title,
      body,
    });
    res.redirect("/dashboard");
  } catch (e) {
    console.log(e);
  }

  // res.render("admin/addpost", { layout: adminLayout });
});

//get edit form
router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const value = await posts.findByPk(req.params.id);
    console.log(value);
    const data = {
      title: value.title,
      body: value.body,
    };
    res.render("admin/editpost", { value, data, layout: adminLayout });
  } catch (e) {
    console.log(e);
  }
});

//edit form post
router.put("/edit-post/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { title, body } = req.body;
    const data = await posts.findByPk(id);
    if (!data) {
      return res.send("Not Found");
    }

    data.update({
      title: title,
      body: body.trim(),
    });
    res.redirect(`/edit-post/${id}`);
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/delete-post/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await posts.findByPk(id);

    if (!data) {
      return res.status(404).send("Post not found");
    }

    // Delete the post
    await data.destroy();

    res.redirect("/dashboard"); // Redirect to the home page or another appropriate page
  } catch (error) {
    console.error("Error deleting post", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
