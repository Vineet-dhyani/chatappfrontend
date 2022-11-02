const settingsConfig = {
	BASE_API_URL: 'https://qa1-front.rum-chat.com/',
	S3_BASE_URL: "https://rumchatwhatsapp.s3-ap-southeast-1.amazonaws.com/",
	layout: {
		style: 'layout1', // layout1 layout2 layout3
		config: {} // checkout default layout configs at app/fuse-layouts for example  app/fuse-layouts/layout1/Layout1Config.js
	},
	customScrollbars: true,
	direction: 'ltr', // rtl, ltr
	theme: {
		main: 'default',
		navbar: 'greyDark',
		toolbar: 'mainThemeLight',
		footer: 'mainThemeDark'
	}
};

export default settingsConfig;
