const Dive = require('../models/dive');

function indexRoute(req, res, next) {
  Dive
    .find()
    .populate('createdBy')
    .exec()
    .then((dives) => res.render('dives/index', { dives }))
    .catch(next);
}

function newRoute(req, res) {
  return res.render('dives/new');
}

function createRoute(req, res, next) {

  req.body.createdBy = req.user;

  Dive
    .create(req.body)
    .then(() => res.redirect('/dives'))
    .catch((err) => {
      if(err.name === 'ValidationError') return res.badRequest(`/dives/${req.params.id}/edit`, err.toString());
      next(err);
    });
}

function showRoute(req, res, next) {
  Dive
    .findById(req.params.id)
    .populate('createdBy comments.createdBy')
    .exec()
    .then((dive) => {
      if(!dive) return res.notFound();
      return res.render('dives/show', { dive });
    })
    .catch(next);
}

function editRoute(req, res, next) {
  Dive
    .findById(req.params.id)
    .exec()
    .then((dive) => {
      if(!dive) return res.redirect();
      // if(!dive.ownedBy(req.user)) return res.unauthorized(`/dives/${dive.id}`, 'You do not have permission to edit that resource');
      return res.render('dives/edit', { dive });
    })
    .catch(next);
}

function updateRoute(req, res, next) {
  Dive
    .findById(req.params.id)
    .exec()
    .then((dive) => {
      if(!dive) return res.notFound();

      for(const field in req.body) {
        dive[field] = req.body[field];
      }

      return dive.save();
    })
    .then(() => res.redirect(`/dives/${req.params.id}`))
    .catch((err) => {
      if(err.name === 'ValidationError') return res.badRequest(`/dives/${req.params.id}/edit`, err.toString());
      next(err);
    });
}

function deleteRoute(req, res, next) {
  Dive
    .findById(req.params.id)
    .exec()
    .then((dive) => {
      if(!dive) return res.notFound();
      return dive.remove();
    })
    .then(() => res.redirect('/dives'))
    .catch(next);
}

function createCommentRoute(req, res, next) {
  console.log('********************');
  req.body.createdBy = req.user;
  console.log('here', req.body.createdBy);

  Dive
    .findById(req.params.id)
    .exec()
    .then((dive) => {
      if(!dive) return res.notFound();
      console.log('got here');
      dive.comments.push(req.body); // create an embedded record
      return dive.save();
    })
    .then((dive) => res.redirect(`/dives/${dive.id}`))
    .catch(next);
}

function deleteCommentRoute(req, res, next) {
  Dive
    .findById(req.params.id)
    .exec()
    .then((dive) => {
      if(!dive) return res.notFound();
      // get the embedded record by its id
      const comment = dive.comments.id(req.params.commentId);
      comment.remove();

      return dive.save();
    })
    .then((dive) => res.redirect(`/dives/${dive.id}`))
    .catch(next);
}

module.exports = {
  index: indexRoute,
  new: newRoute,
  create: createRoute,
  show: showRoute,
  edit: editRoute,
  update: updateRoute,
  delete: deleteRoute,
  createComment: createCommentRoute,
  deleteComment: deleteCommentRoute
};
