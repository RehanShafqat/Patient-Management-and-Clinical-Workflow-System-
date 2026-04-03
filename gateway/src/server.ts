import { config } from "./config/index";
import app from "./app";

app.listen(config.port, () => {
  console.log(
    `Gateway running on port ${config.port} in ${config.nodeEnv} mode`,
  );
});
