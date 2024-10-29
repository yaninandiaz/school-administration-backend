import app from "./app";

const PORT = "8080"; // TODO: add to env properties

app.listen(PORT, () => {
    console.log("Server listening on port:", PORT);
});