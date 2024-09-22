import app from "./app"; // Adjust path based on the location of index.ts

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
