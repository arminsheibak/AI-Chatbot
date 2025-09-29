import express from "express";
import dotenv from "dotenv";
import router from "./routes";
import cors from 'cors'

dotenv.config();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
};

const app = express();
app.use(cors(corsOptions))
app.use(express.json());
app.use(router);



const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server listing on port ${port}`);
});