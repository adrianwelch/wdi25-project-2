const router = require('express').Router();
const registrations = require('../controllers/registrations');
const sessions = require('../controllers/sessions');
const secureRoute = require('../lib/secureRoute');
const dives = require('../controllers/dives');
const users = require('../controllers/users');
const oauth = require('../controllers/oauth');
const upload = require('../lib/upload');

router.get('/', (req, res) => res.render('statics/index'));

router.route('/users')
  .get(users.index);

router.route('/users/:id')
  .get(users.show)
  .put(users.update)
  .delete(users.delete);

router.route('/users/:id/edit')
  .get(secureRoute, users.edit);

router.route('/dives')
  .get(dives.index)
  .post(secureRoute, upload.single('image'), dives.create);

router.route('/dives/new')
  .get(secureRoute, dives.new);


router.route('/dives/:id')
  .get(dives.show)
  .put(secureRoute, dives.update)
  .delete(secureRoute, dives.delete);

router.route('/dives/:id/edit')
  .get(secureRoute, dives.edit);

router.route('/dives/:id/comments')
  .post(secureRoute, dives.createComment);

router.route('/dives/:id/comments/:commentId')
  .delete(secureRoute, dives.deleteComment);

router.route('/register')
.get(registrations.new)
.post(upload.single('image'), registrations.create);

router.route('/login')
.get(sessions.new)
.post(sessions.create);

router.route('/logout')
  .get(sessions.delete);

router.route('/oauth/github')
  .get(oauth.github);

  router.route('/oauth/facebook')
    .get(oauth.facebook);

router.all('*', (req, res) => res.notFound());

module.exports = router;
