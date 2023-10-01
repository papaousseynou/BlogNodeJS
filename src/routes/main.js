const express = require("express");
const router = express.Router();
const Post = require("../models/post");

// Routes
router.get("/", async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Un Blog avec nodeJs, Express et mongoDB",
    };

    // pagination
    let perPage = 10;
    let page = req.query.page || 1;
    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.count();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    // const data = await Post.find();
    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
  }
  // res.render("index", { locals });
});

/**
 *GET/
 *Post - searchTerm
 */

router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Un Blog avec nodeJs, Express et mongoDB",
    };

    let { searchTerm } = req.body;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, " ");

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { summary: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });
    res.render("search", {
      locals,
      data,
      currentRoute: "/",
    });
  } catch (error) {
    console.log(error);
  }
  // res.render("index", { locals });
});

/**
 *GET/
 *Post :id
 */

router.get("/post/:id", async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Un Blog avec nodeJs, Express et mongoDB",
    
    };

    let postId = req.params.id;

    const data = await Post.findById({ _id: postId });
    res.render("post", { locals, data, currentRoute: `/post/${postId}` });
  } catch (error) {
    console.log(error);
  }
  // res.render("index", { locals });
});

router.get("/about", (req, res) => {
  res.render("about", { currentRoute: "/about" });
});

// router.get("/about", (req, res) => {
//   res.render("about");
// });

// function insertPostData() {
//   Post.insertMany([
//     {
//       title: "Football",
//       summary: "Match Barça Mallorca",
//       content: "Le Barça fait match nul et perd la tête du championnat",
//       author: "Ousseynou",
//     },
//     {
//       title: "Football",
//       summary: "Match Real vs Las Palmas",
//       content: "Le Real joue Mercredi sans Arda Guler mais avec Vini jr",
//       author: "Ousseynou",
//     },
//   ]);
// }
// insertPostData();
// exportation des routes

module.exports = router;
