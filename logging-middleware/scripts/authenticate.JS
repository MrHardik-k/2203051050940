import fs from "fs";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function authenticate() {
  const { EMAIL, NAME, ROLL_NO, ACCESS_CODE, CLIENT_ID, CLIENT_SECRET } =
    process.env;

  try {
    const res = await axios.post(
      "http://20.244.56.144/evaluation-service/auth",
      {
        email: EMAIL,
        name: NAME,
        rollNo: ROLL_NO,
        accessCode: ACCESS_CODE,
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
      }
    );

    const token = `${res.data.token_type} ${res.data["access token"]}`;

    const envPath = path.resolve(process.cwd(), ".env");
    let env = fs.readFileSync(envPath, "utf-8");
    env = env.replace(/BEARER_TOKEN=.*/, `BEARER_TOKEN=${token}`);
    fs.writeFileSync(envPath, env);

    console.log("Authentication successful. BEARER_TOKEN saved to .env");
  } catch (err) {
    console.error("Authentication failed:", err.response?.data || err.message);
  }
}

authenticate();
