const express = require("express");
const Users = require("./userDb");
const Posts = require("../posts/postDb");
const router = express.Router();

// router.post req to add a user. if no error send 201 if err send 500
router.post("/users/", validateUser, (req, res) => {
  // do your magic!
  Users.insert(req.body)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error adding the user",
      });
    });
});

//router.post rquest for post, req user id and post id.
//if req met display posts of specific user, if not send err mess
router.post("/users/:id/posts", validateUserId, validatePost, (req, res) => {
  // do your magic!
  Posts.insert(req.post)
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error adding the post",
      });
    });
});

//router. get request to get all users. if req works display users, if not give err 500
router.get("/users", (req, res) => {
  // do your magic!
  Users.get()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the users",
      });
    });
});

//router.get request to find specific user with id, if met display specific user
router.get("/users/:id", validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user);
});

//router.get request to get posts of specific user
//if specific user id met pull up posts, if not catch err and send 500
router.get("/users/:id/posts", validateUserId, (req, res) => {
  // do your magic!
  Users.getUserPosts(req.user.id)
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

//router.delete req to delete specific user with id req.  if succesful remove user, if not send 500
router.delete("/users/:id", validateUserId, (req, res) => {
  // do your magic!
  Users.remove(req.user.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json(req.user);
      } else {
        res.status(404).json({ message: "The user could not be found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error removing the user",
      });
    });
});

//router.put request to update specific user qwith id.  req id and bbody .  if id found display user, display errors if cant update user , 404 and 500
router.put("/users/:id", validateUserId, validateUser, (req, res) => {
  // do your magic!
  Users.update(req.user.id, req.body)
    .then((count) => {
      if (count) {
        Users.getById(req.user.id)
          .then((user) => {
            res.status(200).json(user);
          })
          .catch((err) => {
            req
              .status(500)
              .json({ message: "An error occured during getting user" });
          });
      } else {
        res.status(404).json({ message: "The user could not be found" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error updating the user",
      });
    });
});

//custom middleware

//validate user function . req id params, if user found go to next step if not send mess for fail to find user
function validateUserId(req, res, next) {
  // do your magic!
  const { id } = req.params;

  Users.getById(id)
    .then((user) => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({ message: "invalid user id" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "failed", err });
    });
}

//function tto validate user require body for name, if given pull  up user and go to next step,  if no name body given give 400 message
function validateUser(req, res, next) {
  // do your magic!
  if (!isEmpty(req.body)) {
    if (!req.body.name) {
      res.status(400).json({ message: "missing required name field" });
    } else {
      next();
    }
  } else {
    res.status(400).json({ message: "missing user data" });
  }
}

//function validatepost .  require post body. if no text written in body send missing text message.  if text not missing go to next step
function validatePost(req, res, next) {
  // do your magic!
  if (!isEmpty(req.body)) {
    if (!req.body.text) {
      res.status(400).json({ message: "missing required text field" });
    } else {
      req.post = {
        ...req.body,
        user_id: req.user.id,
      };
      next();
    }
  } else {
    res.status(400).json({ message: "missing post data" });
  }
}

//isEmpty function for req,body if no text added.
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

module.exports = router;
