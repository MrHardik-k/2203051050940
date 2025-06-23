import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const LOG_ENDPOINT = "http://20.244.56.144/evaluation-service/logs";
const AUTH_HEADER = process.env.BEARER_TOKEN;
export async function Log(stack, level, _package, message) {
  try {
    await axios.post(
      LOG_ENDPOINT,
      { stack, level, package: _package, message },
      {
        headers: {
          Authorization: AUTH_HEADER,
        },
      }
    );
  } catch (err) {}
}
