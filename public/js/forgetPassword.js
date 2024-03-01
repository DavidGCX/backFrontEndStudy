/* eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';

export const forgetPassword = async (email) => {
	try {
		const res = await axios({
			method: 'POST',
			url: '/api/v1/users/forgetPassword',
			data: {
				email,
			},
		});
		if (res.data.status === 'success') {
			showAlert('success', 'Token sent to your email!');
			window.setTimeout(() => {
				location.assign('/');
			}, 1500);
		}
	} catch (err) {
		showAlert('error', err.response.data.message);
	}
};

export const resetPassword = async (password, passwordConfirm, resetToken) => {
	try {
		const res = await axios({
			method: 'PATCH',
			url: `/api/v1/users/resetPassword/${resetToken}`,
			data: {
				password,
				passwordConfirm,
			},
		});
		if (res.data.status === 'success') {
			showAlert('success', 'Password reset successfully!');
			window.setTimeout(() => {
				location.assign('/');
			}, 1500);
		}
	} catch (err) {
		showAlert('error', err.response.data.message);
	}
};
