export default () => ({
	app: {
		name: process.env.APP_NAME ?? 'notix',
		env: process.env.NODE_ENV ?? 'development',
		port: process.env.PORT ? Number(process.env.PORT) : 3000,
	},
});
