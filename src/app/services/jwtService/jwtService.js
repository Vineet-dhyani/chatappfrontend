import FuseUtils from '@fuse/utils/FuseUtils';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import getAccessToken from 'app/shared-components/commons';
import axiosInstance from '../axiosConfig';
import { snackActions } from '../../main/components/notification';
/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
	init() {
		this.setInterceptors();
		this.handleAuthentication();
	}

	setInterceptors = () => {
		console.log("inside setInterceptors")
		axiosInstance.interceptors.response.use(
			response => {
				return response;
			},
			err => {
				console.log("inside setInterceptors =>", err)
				if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
					// if you ever get an unauthorized response, logout the user
					this.emit('onAutoLogout', '');
					this.setSession(null);
				} else if (err.response.status === 403) {
					// snackActions.error('You are not having permission to access this page.');
					console.log("Failed")
				} else {
					// snackActions.error(err?.response?.data?.errors?.message || 'Network Error: Something went wrong');
					console.log("Failed")
				}
				return Promise.reject(err);
				// throw err;
			}
		);
	};

	handleAuthentication = () => {
		const access_token = getAccessToken();

		if (!access_token) {
			this.emit('onNoAccessToken');

			return;
		}

		if (this.isAuthTokenValid(access_token)) {
			this.setSession(access_token);
			this.emit('onAutoLogin', true);
		} else {
			console.log("inside no")
			this.setSession(null);
			this.emit('onAutoLogout', 'access_token expired');
		}
	};

	createUser = data => {
		return new Promise((resolve, reject) => {
			axios.post('/api/auth/register', data).then(response => {
				if (response.data.user) {
					this.setSession(response.data.access_token);
					resolve(response.data.user);
				} else {
					reject(response.data.error);
				}
			});
		});
	};

	// signInWithEmailAndPassword = (email, password) => {
	// 	return new Promise((resolve, reject) => {
	// 		axios
	// 			.get('/api/auth', {
	// 				data: {
	// 					email,
	// 					password
	// 				}
	// 			})
	// 			.then(response => {
	// 				if (response.data.user) {
	// 					this.setSession(response.data.access_token);
	// 					resolve(response.data.user);
	// 				} else {
	// 					reject(response.data.error);
	// 				}
	// 			});
	// 	});
	// };
	signInWithEmailAndPassword = (email, password, asAnotherUser, showNotification, history) => {
		const body = {
			email,
			password
		};
		if (asAnotherUser) {
			body.asAnotherUser = asAnotherUser;
		}

		return new Promise((resolve, reject) => {
			axiosInstance
				.post('/api/auth/login', body)
				.then(response => {
					if (response.data.success) {
						this.setSession(response.data.token);
						resolve(response.data);
					} else {
						reject(response.error);
					}
				})
				.catch(error => {
					showNotification ? '' : snackActions.error('Login failed: Invalid username or password');
				// 	showNotification ? '' : reject(error);
				// 	showNotification && error
				// 		? history.push({
				// 				pathname: '/auth/login',
				// 				state: { redirectUrl: '/chat-widget-girnarcare' }
				// 		  })
				// 		: '';
				console.log("Error =>", error);
				reject(error);
				});
		});
	};

	signInWithToken = () => {
		console.log("signInWithToken ==>")
		return new Promise((resolve, reject) => {
			axios
				.get('/api/auth/access-token', {
					data: {
						access_token: getAccessToken()
					}
				})
				.then(response => {
					console.log("signInWithToken", response)
					if (response.data.user) {
						this.setSession(response.data.access_token);
						resolve(response.data.user);
					} else {
						console.log("Inside else logout signInWithToken")
						this.logout();
						reject(new Error('Failed to login with token.'));
					}
				})
				.catch(error => {
					console.log("Error token ==>", error)
					this.logout();
					reject(new Error('Failed to login with token.'));
				});
		});
	};

	updateUserData = user => {
		return axios.post('/api/auth/user/update', {
			user
		});
	};

	setSession = access_token => {
		console.log("Acces token ==>", access_token)
		if (access_token) {
			localStorage.setItem('jwt_access_token', access_token);
			axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
		} else {
			localStorage.removeItem('jwt_access_token');
			delete axios.defaults.headers.common.Authorization;
		}
	};

	logout = () => {
		console.log("Inside logout")
		this.setSession(null);
	};

	isAuthTokenValid = access_token => {
		if (!access_token) {
			return false;
		}
		const decoded = jwtDecode(access_token);
		const currentTime = Date.now() / 1000;
		// if (decoded.exp < currentTime) {
		// 	console.warn('access token expired');
		// 	return false;
		// }

		return true;
	};

	getDecodedAccessToken = () => {
		const access_token = getAccessToken();
		const isAuthTokenValid = this.isAuthTokenValid(access_token);
		if (isAuthTokenValid) {
			const decoded = jwtDecode(access_token);
			return decoded;
		}
		return false;
	};

	getAccessToken = () => {
		return window.localStorage.getItem('jwt_access_token');
	};
}

const instance = new JwtService();

export default instance;
