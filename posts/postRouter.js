const express = require("express");
const Posts = require("./postDb");
const Users = require("../users/userDb");
const router = express.Router();

//router.get request for posts with user id, display post

router.get("/:id/posts", validatePostId, (req, res) => {
  // do your magic!
  res.status(200).json(req.post);
});

//router.get request to pull all post, display post or 500 if not successful
router.get("/", (req, res) => {
  // do your magic!
  Posts.get()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the posts",
      });
    });
});

//router.delete request for specific user with id and for specific post with post id
//if/else statement for if id post found (200) or not (404)
router.delete("/users/:id/posts/:id", validatePostId, (req, res) => {
  // do your magic!
  Posts.remove(req.post.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json(req.post);
      } else {
        res.status(404).json({ message: "The post could not be found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error removing the post",
      });
    });
});

//router.put request to update specific post with id
//if/else statement to req id and body and what happens if not succesful (500, 404)
router.put(
  "/users/:id/posts/:id",
  validatePostId,
  /*validatePost,*/ (req, res) => {
    // do your magic!
    Posts.update(req.post.id, req.body)
      .then((count) => {
        if (count) {
          Posts.getById(req.post.id)
            .then((post) => {
              res.status(200).json(post);
            })
            .catch((err) => {
              req
                .status(500)
                .json({ message: "An error occured during getting post" });
            });
        } else {
          res.status(404).json({ message: "The post could not be found" });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: "Error updating the post",
        });
      });
  }
);

// custom middleware

//function to get post by id. if right post post is validated else send 400 and or 500
function validatePostId(req, res, next) {
  // do your magic!
  const { id } = req.params;
  Posts.getById(id)
    .then((post) => {
      if (post) {
        req.post = post;
        next();
      } else {
        res.status(400).json({ message: " invalid post request" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "did not work", err });
    });
}

/*function validatePost(req, res, next) {
  if (!(Object.keys(req.body).length === 0)) {
    if (!req.body.text) {
      res.status(400).json({ message: "missing required text field" });
    } else {
      next();
    }
  } else {
    res.status(400).json({ message: "missing post data" });
  }
}*/

module.exports = router;
