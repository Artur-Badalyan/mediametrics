import app from "./app";
import settings from "#src/settings";

app.listen(settings.port, () => {
  console.log(`Server is running on port ${settings.port}`);
});