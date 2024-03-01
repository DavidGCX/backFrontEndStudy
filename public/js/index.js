/*eslint-disable*/
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { displayMap } from './mapbox';
import { login, logout, signup } from './login';
import { updateSettings } from './updateSettings';
import { forgetPassword, resetPassword } from './forgetPassword';
// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const updateUserDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const resetPasswordForm = document.querySelector('.form--ResetPassword');
const forgetPasswordForm = document.querySelector('.form--ForgetPassword');
const signupForm = document.querySelector('.form--signUp');
const emailVerified = document.querySelector('.email-verified');
if (mapBox) {
	const locations = JSON.parse(mapBox.dataset.locations);
	displayMap(locations);
}

if (resetPasswordForm) {
	const resetToken = window.location.pathname.split('/')[2];
	resetPasswordForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const password = document.getElementById('password').value;
		const passwordConfirm = document.getElementById('password-confirm').value;
		resetPassword(password, passwordConfirm, resetToken);
	});
}

if (forgetPasswordForm) {
	forgetPasswordForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const email = document.getElementById('email').value;
		forgetPassword(email);
	});
}
if (signupForm) {
	signupForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const name = document.getElementById('name').value;
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		const passwordConfirm = document.getElementById('password-confirm').value;
		signup(name, email, password, passwordConfirm);
	});
}

if (loginForm) {
	loginForm.addEventListener('submit', (e) => {
		e.preventDefault();
		const email = document.getElementById('email').value;
		const password = document.getElementById('password').value;
		login(email, password);
	});
}

if (logoutBtn) {
	logoutBtn.addEventListener('click', () => {
		logout();
	});
}

if (updateUserDataForm) {
	updateUserDataForm.addEventListener('submit', async (e) => {
		e.preventDefault();
		document.querySelector('.btn--save-settings').textContent = 'Updating...';
		const form = new FormData();
		form.append('name', document.getElementById('name').value);
		form.append('email', document.getElementById('email').value);
		form.append('photo', document.getElementById('photo').files[0]);
		await updateSettings(form, 'data');
		document.querySelector('.btn--save-settings').textContent = 'Save settings';
	});
}

if (userPasswordForm) {
	userPasswordForm.addEventListener('submit', async (e) => {
		e.preventDefault();
		document.querySelector('.btn--save-password').textContent = 'Updating...';
		const passwordCurrent = document.getElementById('password-current').value;
		const password = document.getElementById('password').value;
		const passwordConfirm = document.getElementById('password-confirm').value;
		await updateSettings(
			{ passwordCurrent, password, passwordConfirm },
			'password',
		);
		document.querySelector('.btn--save-password').textContent = 'Save password';
		document.getElementById('password-current').value = '';
		document.getElementById('password').value = '';
		document.getElementById('password-confirm').value = '';
	});
}

if (emailVerified) {
	setTimeout(() => {
		location.assign('/me');
	}, 1500);
}
