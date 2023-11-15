import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import express from "express";

const setupMiddlewares = (app) => {
  app.use(helmet());
  app.use(cors());

  if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
  }

  app.use(
    express.json({
      verify: (req, res, buffer) => (req["rawBody"] = buffer)
    })
  );


};

export default setupMiddlewares;
