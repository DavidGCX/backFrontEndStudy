const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const usersRouter = express.Router();

usersRouter.post('/signup', authController.signup);
usersRouter.post('/login', authController.login);
usersRouter.get('/logout', authController.logout);

usersRouter.post('/forgetPassword', authController.forgetPassword);
usersRouter.patch('/resetPassword/:resetToken', authController.resetPassword);
// due to the sequential nature of the middleware, we can use the protect middleware to protect the routes that come after it
usersRouter.use(authController.protect);
usersRouter.patch('/updateMyPassword', authController.updatePassword);

usersRouter.get('/me', userController.getMe, userController.getUser);
usersRouter.patch(
	'/updateMe',
	userController.uploadUserPhoto,
	userController.resizeUserPhoto,
	userController.updateMe,
);
usersRouter.delete('/deleteMe', userController.deleteMe);

usersRouter.use(authController.restrictTo('admin'));
usersRouter
	.route('/')
	.get(userController.getUsers)
	.post(userController.createUser);
usersRouter
	.route('/:id')
	.get(userController.getUser)
	.patch(userController.patchUser)
	.delete(userController.deleteUser);
module.exports = usersRouter;
