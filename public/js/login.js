/* eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
	try {
		const res = await axios({
			method: 'POST',
			url: '/api/v1/users/login',
			data: {
				email,
				password,
			},
		});
		// console.log(res.data.status);
		if (res.data.status === 'success') {
			showAlert('success', 'Logged in successfully!');
			window.setTimeout(() => {
				location.assign('/');
			}, 1500);
		} else if (res.data.status === 'not verified') {
			showAlert('error', 'Please verify your email before logging in.');
		}
	} catch (err) {
		showAlert('error', err.response.data.message);
	}
};

export const logout = async () => {
	try {
		const res = await axios({
			method: 'GET',
			url: '/api/v1/users/logout',
		});
		if (res.data.status === 'success')
			window.setTimeout(() => {
				location.assign('/');
			}, 500);
	} catch (err) {
		showAlert('error', 'Error logging out! Try again.');
	}
};

export const signup = async (name, email, password, passwordConfirm) => {
	try {
		const res = await axios({
			method: 'POST',
			url: '/api/v1/users/signup',
			data: {
				name,
				email,
				password,
				passwordConfirm,
			},
		});
		if (res.data.status === 'success') {
			showAlert(
				'success',
				'Signed up successfully! Check your email to verify your account.',
			);
		} else if (res.data.status === 'not verified') {
			showAlert('success', 'A verification email has been sent to your email.');
			window.setTimeout(() => {
				location.assign('/emailWaitForVerify');
			}, 1500);
		}
	} catch (err) {
		showAlert('error', err.response.data.message);
	}
};
