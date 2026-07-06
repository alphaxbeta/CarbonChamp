import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { execFile } from "child_process";
import path from "path";

dotenv.config();

const app = express();
const PORT = 3000;

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;


function getTimeOfDay(): number {
  const hour = new Date().getHours();
  if (hour < 12) return 0;      
  if (hour < 18) return 1;      
  return 2;                    
}


const userState = {
  heaterIsOn: true
};


app.get("/api/smart-weather-suggestions", async (req, res) => {
  const location = (req.query.location as string) || "Denver";

  try {
    const weatherData = await getWeather(location);
    const temp = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const timeOfDay = getTimeOfDay();
    const heaterIsOn = userState.heaterIsOn ? 1 : 0;

    
    const scriptPath = path.join(__dirname, "predict_suggestion.py");
    const args = [temp.toString(), humidity.toString(), timeOfDay.toString(), heaterIsOn.toString()];

    execFile("python3", [scriptPath, ...args], (error, stdout, stderr) => {
      if (error) {
        console.error("Python error:", error);
        return res.status(500).json({ error: "AI model failed" });
      }

      const prediction = parseInt(stdout.trim());
      const suggestion = prediction === 1
        ? `It's ${temp}°C outside. You might want to turn off the heater.`
        : "No action needed based on current conditions.";

      res.json({
        temperature: temp,
        humidity,
        heaterIsOn: userState.heaterIsOn,
        suggestion
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Weather data fetch failed" });
  }
});

// Fetch weather data
async function getWeather(city: string) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`;
  const response = await axios.get(url);
  return response.data;
}

app.listen(PORT, () => {
  console.log(`Smart AI server running at http://localhost:${PORT}`);
});
