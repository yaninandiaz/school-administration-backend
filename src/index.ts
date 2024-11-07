import dotenv from "dotenv";
import app from "./app";
import Logger from "./utils/logger";

dotenv.config();

const PORT = process.env.PORT || "8080";

app.listen(PORT, () => {
    Logger.info("Server listening on port:", PORT);
});