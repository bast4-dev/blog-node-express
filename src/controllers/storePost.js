const BlogPost = require('../models/BlogPost');
const User = require('../models/User');
const path = require('path');

module.exports = async (req, res) => {
    const { title, body } = req.body;
    const image = req.files && req.files.image ? req.files.image.name : null;

    if (image) {
        req.files.image.mv(path.join(__dirname, '../../public/images', image), (err) => {
            if (err) console.error("Error uploading image:", err);
        });
    }

    const user = await User.findById(req.session.userId);

    await BlogPost.create({
        title,
        body,
        image,
        username: user.username,
        userid: req.session.userId
    });

    res.redirect('/');
};