const express = require("express");
const router = express.Router();
const save = require("../models/model");

// home route
router.get("/", async (req, res) => {
  try {
    const locals = {
      title: "Blog site",
      description: "Blog site example",
    };
    const data = await save.findAll();
    res.render("index", { locals, data });
  } catch (e) {
    console.log(e);
  }
});

router.post("/post", (req, res) => {
  try {
    console.log(req.body);
    const title = req.body.title;
    const body = req.body.body;
    save.create({
      title: title,
      body: body,
    });

    res.send("Success");
  } catch (e) {
    console.log(e);
  }
});

// get by id

router.get("/posts/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await save.findByPk(id);
    const locals = {
      title: data.title,
      description: data.body,
    };

    res.render("post", { locals, data });
  } catch (e) {
    console.log(e);
  }
});

router.get("/about", (req, res) => {
  res.render("about");
});

module.exports = router;

// post search term,

router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "",
      description: "",
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChars = searchTerm.replace(/[^a-zA-z0-9]/g, "");
    const data = await save.findAll({
      $or: [
        {
          title: { $regex: new RegExp(searchNoSpecialChars, "i") },
          body: { $regex: new RegExp(searchNoSpecialChars, "i") },
        },
      ],
    });
    res.render("search", { locals, data });
  } catch (e) {
    console.log(e);
  }
});
