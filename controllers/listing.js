const Listing = require("../models/listing");


//Index Route
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};


//New Route
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


//Show Route
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
        }
    })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested does not exists !");
        res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};


//Create Route
module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "Successfully added a new listing!");
    res.redirect("/listings");
};


//Edit Route
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exists !");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};


//Update Route
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(curruser._id)) {
        req.flash("error", "You don't have permission to uodate this listing");
        return res.redirect(`/listings/${id}`);
    }

    let listing2 = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing2.image = { url, filename };
        await listing2.save();
    }

    req.flash("success", "Successfully updated listing");
    res.redirect(`/listings/${id}`);
};


//Delete Route
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Successfully Deleted listing!");
    res.redirect("/listings");
};