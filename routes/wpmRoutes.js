//This is the routing service file. All the API routes are defined here

const express = require("express");
const router = express.Router();

const passport = require("passport");
const isAuth = require("./authMiddleware").isAuth;
const isAdmin = require("./authMiddleware").isAdmin;

const mongoose = require("mongoose");
const User = require("../models/wpmUsers");

const fs = require("fs");
const sharp = require("sharp");

const multer = require("multer");

require("dotenv").config();

const {
  getPasswords,
  getPassword,
  createPWTrans,
  deletePwTrans,
  updatePWTrans,
  showImage,
  createUser,
  updateUser,
  changePassword,
  forgot_post,
  reset_token_get,
  reset_token_post,
  resetPassword,
  getUsers,
  deleteUser,
  checkPassword,
} = require("../controllers/wpmController");

//define storage for the photo uploads
const storage = multer.memoryStorage(); //this is a good way to minimize file saving into the disk - just save it into memory as a buffer
const upload = multer({ storage });

//middleware to reduce image size using 'sharp' before saving to mongoDB database
const savePhotoDb = async (req, res, next) => {
  const gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    chunkSizeBytes: 1024,
    bucketName: "wpmdocs",
  });
  // console.log("Filename being uploaded: ", req.file.originalname);
  // shrink image before uploading to MongoDb
  const fname = `public/images/wpm-${Date.now()}-${req.file.originalname}`; //file to contain the sharpened image

  try {
    await sharp(req.file.buffer, { failOnError: false }) //using buffer here as the source to 'sharp'
      .resize(600, 600, {
        fit: sharp.fit.inside,
        withoutEnlargement: true, // if image's original width or height is less than specified width and height, sharp will do nothing(i.e no enlargement)
      })
      .toFile(fname); //save the 'sharp'-en image into a file. the idea of saving it to a file (with a filename) is because inside the mongoDb database, the filename is used as the reference inside 'sosdocs.file'
  } catch (error) {
    throw error;
  }

  //now, save to mongoDB database the photo
  fs.createReadStream(fname)
    .pipe(gridFSBucket.openUploadStream(fname.slice(14, fname.length))) //up to the filename part ('sos-req.file.filename')
    .on("error", () => {
      console.log("Some error occured:" + error);
      res.send(error);
    })
    .on("finish", () => {
      console.log("done saving image to mongoDB");

      req.fname = fname.slice(14, fname.length); //stuff the 'req' object with the filename (fname.slice(14, fname.length)) as this is needed
      //in the saving of the rest of req.body from the client. This (req.fname) goes to the 'attachment' field

      next();
    });
};

/**
 * -------------- USER ROUTES ----------------
 */

//Login a user
router.post(
  "/login",
  (req, res, next) => {
    // console.log(req.body);
    next();
  },
  passport.authenticate("local", {
    failureRedirect: "/api/wpm/login-failure",
    successRedirect: "/api/wpm/login-success",
  })
);
//Successful login
router.get("/login-success", (req, res, next) => {
  console.log("Login success");
  // console.log("user: ", req.user);
  const user = {
    id: req.user._id,
    email: req.user.email,
    lastname: req.user.lastname,
    firstname: req.user.firstname,
    auth: true,
    attachment: req.user.attachment,
  };
  res.json(user);
});

//Login fail
router.get("/login-failure", (req, res, next) => {
  console.log("Failed login");
  const user = {
    id: null,
    email: null,
    lastname: null,
    firstname: null,
    auth: false,
    attachment: null,
  };
  // res.send("You entered the wrong password.");
  res.json(user);
});

//Check user password
router.post("/checkpasswd/", isAuth, checkPassword);

//Change user password
router.post("/passwd", isAuth, changePassword);

//Forgot user password
router.post("/forgot", forgot_post);
router.get("/reset/:token", reset_token_get);
router.post("/reset/:token", reset_token_post);
router.post("/resetpwd", resetPassword);

//Get all users
router.get("/allusers", isAuth, getUsers);

//Register a new user
router.post("/register", upload.single("file"), savePhotoDb, createUser); //Notice the middleware to upload the file to MongoDb

//Update user profile information
router.post(
  "/user/:id",
  isAuth,
  upload.single("file"),
  savePhotoDb,
  updateUser
);

//Check for duplicate user (email address)
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.id });
    // console.log(user);
    res.json({ duplicate: user ? true : false });
  } catch (error) {
    console.log(error);
    res.status(401);
  }
});

// DELETE a user
router.delete("/user/:id", isAuth, deleteUser);

//Sample of protected route
router.get("/protected-route", isAuth, (req, res, next) => {
  res.send("You made it to the route.");
});

//Sample of admin route
router.get("/admin-route", isAdmin, (req, res, next) => {
  res.send("You made it to the admin route.");
});

//User logout
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

/**
 * -------------- PASSWORD TRANSACTION ROUTES ROUTES ----------------
 */

/*----
  getPasswords,
  getPassword,
  createPWTrans,
  deletePwTrans,
  updatePWTrans,
---*/

//Password transaction routes

//Get list of all passwords
router.get("/allpasswords/:id", isAuth, getPasswords);

// GET a single password transaction
router.get("/:id", isAuth, getPassword);

// POST a new password transaction
router.post("/", isAuth, createPWTrans);

// DELETE a password transaction
router.delete("/:id", isAuth, deletePwTrans);

// UPDATE a password transaction
router.patch("/:id", isAuth, updatePWTrans);

router.get("/image/:filename", showImage);

module.exports = router;
