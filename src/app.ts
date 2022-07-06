import "express-async-errors";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";

import { ErrorHandler } from "./shared/http/middleware/ErrorHandler";
import { taskRouter } from "./shared/http/routes/taskRoute";
import { userRouter } from "./shared/http/routes/userRoute";
import swaggerFile from "./swagger.json";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/v1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/v1/api/users", userRouter);
app.use("/v1/api/tasks", taskRouter);

app.use(ErrorHandler.handler);

export { app };
