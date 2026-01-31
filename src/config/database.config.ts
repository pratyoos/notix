export default () => ({
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    username: process.env.DB_USERNAME ?? 'pratyoos',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'notix',
    name: process.env.DB_NAME ?? 'notix',
  },
});
