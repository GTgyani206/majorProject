const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

const listingController = require("../controllers/listing.js");

router.route("/")
//index route
.get( wrapAsync(listingController.index))
//create route
.post( isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));


//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
//show route
.get( validateListing, wrapAsync(listingController.showListing))
//update route
.put( isLoggedIn, upload.single('listing[image]'),isOwner,  validateListing, wrapAsync(listingController.updateListing))
//delete route
.delete( isLoggedIn, validateListing, isOwner, wrapAsync(listingController.deleteListing));


//Edit Route
router.get("/:id/edit", validateListing, isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;