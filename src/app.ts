import "express-async-errors";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { userRouter } from "./routes/userRoute";
import { taskRouter } from "./routes/taskRoute";

import { ErrorHandler } from "./middleware/ErrorHandler";

import swaggerFile from "./swagger.json";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/v1/api/users", userRouter);
app.use("/v1/api/tasks", taskRouter);

app.use(ErrorHandler.handler);

export { app };
