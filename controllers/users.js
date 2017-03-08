const User = require('../models/user');
const Dive = require('../models/dive');

function indexRoute(req, res) {
  User
    .find()
    .exec()
    .then((users) => {
      res.render('users/index', { users });
    })
    .catch((err) => {
      res.status(500).end(err);
    });
}

function newRoute(req, res){
  res.render('users/new');
}

function showRoute(req, res, next) {
  User.findById(req.params.id)
  .then((showUser) => {
    return Dive.find({createdBy: showUser.id})
    .then((dives) => {
      res.render('users/show', { showUser, dives });
    })
    .catch(next);
  });
}
// function showRoute(req, res, next) {
//   User
//     .findById(req.params.id)
//     .exec()
//     .then((user) => {
//       if(!user) return res.status(404).send('Not found');
//       res.render('users/show', { user });
//     })
//     .catch((err) => {
//       res.status(500).end(err);
//     });
// }

// function showRoute(req, res) {
//   res.render('users/show');
// }

function createRoute(req, res) {
  User
    .create(req.body)
    .then(() => {
      res.redirect('/users');
    })
    .catch((err) => {
      res.status(500).end(err);
    });
}

function editRoute(req, res) {
  User
    .findById(req.params.id)
    .exec()
    .then((user) => {
      if(!user) return res.status(404).send('Not found');
      res.render('users/edit', { user });
    })
    .catch((err) => {
      res.status(500).end(err);
    });
}

function updateRoute(req, res) {
  User
    .findById(req.params.id)
    .exec()
    .then((user) => {
      if(!user) return res.status(404).send('Not found');

      for(const field in req.body) {
        user[field] = req.body[field];
      }

      return user.save();
    })
    .then((user) => {
      res.redirect(`/users/${user.id}`);
    })
    .catch((err) => {
      res.status(500).end(err);
    });
}

function deleteRoute(req, res) {
  User
    .findById(req.params.id)
    .exec()
    .then((user) => {
      if(!user) return res.status(404).send('Not found');

      return user.remove();
    })
    .then(() => {
      res.redirect('/users');
    })
    .catch((err) => {
      res.status(500).end(err);
    });
}

function newImageRoute(req, res) {
  res.render('users/newImage');
}

function createImageRoute(req, res, next) {
  if(req.file) req.body.filename = req.file.key;

  // For some reason multer's req.body doesn't behave like body-parser's
  req.body = Object.assign({}, req.body);

  req.user.images.push(req.body);

  req.user
    .save()
    .then(() => res.redirect('/user'))
    .catch((err) => {
      console.log(err);
      if(err.name === 'ValidationError') return res.badRequest('/user/images/new', err.toString());
      next(err);
    });
}

module.exports = {
  index: indexRoute,
  new: newRoute,
  show: showRoute,
  create: createRoute,
  edit: editRoute,
  update: updateRoute,
  delete: deleteRoute,
  newImage: newImageRoute,
  createImage: createImageRoute
};
