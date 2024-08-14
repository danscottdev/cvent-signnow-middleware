import express from 'express';
import morgan from 'morgan';
import events from './routes/events';
import { port } from './utils/envs';

const app: express.Application = express();
app.use(morgan('combined'));

app.use('/events', events);

app.listen(port, () => {
  console.info(`⚡️[server]: Server is running at https://localhost:${port}`);
});
