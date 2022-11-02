import axios from 'axios';
import FuseSettingsConfig from 'app/fuse-configs/settingsConfig';
import getAccessToken from 'app/shared-components/commons';
import { snackActions } from '../main/components/notification';

const instance = axios.create({
	baseURL: FuseSettingsConfig.BASE_API_URL
});

function responseHelper(response) {
	if (response?.status === 200 || response?.status === 201) {
		return response;
	}
	return null;
}

// function errorHelper(err) {
// 	return new Promise((resolve, reject) => {
// 		if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
// 			// if you ever get an unauthorized response, logout the user
// 			// jwtService.emit('onAutoLogout', 'Invalid access_token');
// 			// jwtService.setSession(null);
// 		}
// 		if (err.response.status === 403) {
// 			snackActions.error('You are not having permission to access this page.');
// 		}
// 		// throw err;
// 	});
// 	// if (error?.response?.data?.errors) {
// 	// 	const message = error.response.data.errors;
// 	// 	if (message?.password) {
// 	// 		return message.password;
// 	// 	}
// 	// }
// 	return null;
// }

instance.interceptors.request.use(
	function configHeader(config) {
		config.headers = { ...config.headers, Authorization: getAccessToken() };
		// you can also do other modification in config
		return config;
	},
	function configError(error) {
		console.log('Error in axios', error);
		return Promise.reject(error);
	}
);
// instance.interceptors.response.use(responseHelper, errorHelper);

export default instance;
