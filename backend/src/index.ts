import { getExpressApp } from "./app";

const start = async () => {
  const app = await getExpressApp();
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
  });
}

start();