import { yupResolver } from '@hookform/resolvers/yup';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { submitLogin } from 'app/auth/store/loginSlice';
import FuseSettingsConfig from 'app/fuse-configs/settingsConfig';
import jwtService from '../../../services/jwtService/index';
import { setUserData } from '../../../auth/store/userSlice';
import * as yup from 'yup';
import _ from '@lodash';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	email: yup.string().email('You must enter a valid email').required('You must enter a email'),
	password: yup
		.string()
		.required('Please enter your password.')
		.min(4, 'Password is too short - should be 4 chars minimum.')
});

const defaultValues = {
	email: '',
	password: '',
	remember: false
};

const s3URL = FuseSettingsConfig.S3_BASE_URL;
console.log("s3URL =>", s3URL)
function JWTLoginTab(props) {
	const dispatch = useDispatch();
	const login = useSelector(({ auth }) => auth.login);
	const { control, setValue, formState, handleSubmit, reset, trigger, setError } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

	// const { isValid, dirtyFields, errors } = formState;

	const [showPassword, setShowPassword] = useState(false);

	// useEffect(() => {
	// 	setValue('email', 'admin@fusetheme.com', { shouldDirty: true, shouldValidate: true });
	// 	setValue('password', 'admin', { shouldDirty: true, shouldValidate: true });
	// }, [reset, setValue, trigger]);

	useEffect(() => {
		// const { cookie } = document;
		// if (cookie && cookie !== 'email=') {
		// const cookieArray = cookie.split(' ');
		// cookieArray.forEach(item => {
		// const [name, value] = item.split('=');
		// if (value) {
		// setValue(name, value, { shouldValidate: true });
		// }
		// });
		// trigger();
		// }
		const rememberMeValue = localStorage.getItem('rememberMe') === 'false' ? Boolean(false) : Boolean(true);
		reset({
			...defaultValues,
			...{ remember: rememberMeValue }
		});
	}, []);

	const { isValid, dirtyFields, errors } = formState;

	// useEffect(() => {
	// 	login.errors.forEach(error => {
	// 		setError(error.type, {
	// 			type: 'manual',
	// 			message: error.message
	// 		});
	// 	});
	// }, [login.errors, setError]);

	async function onSubmit(data) {
		const resp = await jwtService.signInWithEmailAndPassword(data.email, data.password);
		const decodedData = jwtService.getDecodedAccessToken();

		if (decodedData) {
			reset(defaultValues);
			const { id, email, full_name: fullName, role, permissions, profile_image: profileImg } = decodedData;
			dispatch(
				setUserData({
					role: [`admin`],
					redirectUrl: '/apps/chat',
					data: {
						displayName: fullName,
						email,
						// photoURL: profileImg ? s3URL.concat(profileImg) : '',
						id,
						permissions
					}
				})
			);
			// history.push('/chat');
			window.location.reload();
			localStorage.setItem('rememberMe', data.remember);
			// if (data.remember) {
			// 	document.cookie = `email=${data.email} password=${data.password} remember=${data.remember}; Path=/auth`;
			// } else {
			// 	document.cookie = `email=; Path=/auth`;
			// }
		}
		// dispatch(submitLogin(model));
	}

	return (
		<div className="w-full">
			<form className="flex flex-col justify-center w-full" onSubmit={handleSubmit(onSubmit)}>
				<Controller
					name="email"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-16"
							type="text"
							error={!!errors.email}
							helperText={errors?.email?.message}
							label="Email"
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<Icon className="text-20" color="action">
											user
										</Icon>
									</InputAdornment>
								)
							}}
							variant="outlined"
						/>
					)}
				/>

				<Controller
					name="password"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-16"
							label="Password"
							type="password"
							error={!!errors.password}
							helperText={errors?.password?.message}
							variant="outlined"
							InputProps={{
								className: 'pr-2',
								type: showPassword ? 'text' : 'password',
								endAdornment: (
									<InputAdornment position="end">
										<IconButton onClick={() => setShowPassword(!showPassword)}>
											<Icon className="text-20" color="action">
												{showPassword ? 'visibility' : 'visibility_off'}
											</Icon>
										</IconButton>
									</InputAdornment>
								)
							}}
							required
						/>
					)}
				/>

				<Button
					type="submit"
					variant="contained"
					color="primary"
					className="w-full mx-auto mt-16"
					aria-label="LOG IN"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					value="legacy"
				>
					Login
				</Button>
			</form>

			<table className="w-full mt-32 text-center">
				<thead className="mb-4">
					<tr>
						<th>
							<Typography className="font-semibold text-11" color="textSecondary">
								Role
							</Typography>
						</th>
						<th>
							<Typography className="font-semibold text-11" color="textSecondary">
								Email
							</Typography>
						</th>
						<th>
							<Typography className="font-semibold text-11" color="textSecondary">
								Password
							</Typography>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<Typography className="font-medium text-11" color="textSecondary">
								Admin
							</Typography>
						</td>
						<td>
							<Typography className="text-11">admin@fusetheme.com</Typography>
						</td>
						<td>
							<Typography className="text-11">admin</Typography>
						</td>
					</tr>
					<tr>
						<td>
							<Typography className="font-medium text-11" color="textSecondary">
								Staff
							</Typography>
						</td>
						<td>
							<Typography className="text-11">staff@fusetheme.com</Typography>
						</td>
						<td>
							<Typography className="text-11">staff</Typography>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

export default JWTLoginTab;