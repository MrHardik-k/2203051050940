import fs from "fs";
import path from "path";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function register() {
  const {
    EMAIL,
    NAME,
    MOBILE_NO,
    GITHUB_USERNAME,
    ROLL_NO,
    COLLEGE_NAME,
    ACCESS_CODE,
  } = process.env;

  try {
    const res = await axios.post(
      "http://20.244.56.144/evaluation-service/register",
      {
        email: EMAIL,
        name: NAME,
        mobileNo: MOBILE_NO,
        githubUsername: GITHUB_USERNAME,
        rollNo: ROLL_NO,
        collegeName: COLLEGE_NAME,
        accessCode: ACCESS_CODE,
      }
    );

    const { clientID, clientSecret } = res.data;

    const envPath = path.resolve(process.cwd(), ".env");
    let env = fs.readFileSync(envPath, "utf-8");
    env = env
      .replace(/CLIENT_ID=.*/, `CLIENT_ID=${clientID}`)
      .replace(/CLIENT_SECRET=.*/, `CLIENT_SECRET=${clientSecret}`);
    fs.writeFileSync(envPath, env);

    console.log(
      "Registration successful. CLIENT_ID and CLIENT_SECRET saved to .env"
    );
  } catch (err) {
    console.error("Registration failed:", err.response?.data || err.message);
  }
}

register();
