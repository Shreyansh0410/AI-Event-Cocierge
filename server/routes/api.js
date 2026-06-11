import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "../lib/supabase.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/suggest — generate a venue proposal
router.post("/suggest", async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an expert corporate event planner with deep knowledge of venues worldwide.
A client has described their event as follows: "${query}"

Based on this, recommend the single best venue that fits their needs.
Return ONLY a valid JSON object — no markdown, no code fences, no extra text whatsoever.

The JSON must have exactly these fields:
{
  "venue_name": "Full name of the venue",
  "location": "City, Country",
  "estimated_cost": "e.g. $3,200 – $3,800 total",
  "why_it_fits": "2-3 sentences explaining why this venue perfectly matches the client's request, referencing their specific needs like group size, budget, setting, and duration."
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip any accidental markdown fences
    const clean = text.replace(/```json|```/g, "").trim();
    const proposal = JSON.parse(clean);

    // Validate required fields
    const required = ["venue_name", "location", "estimated_cost", "why_it_fits"];
    for (const field of required) {
      if (!proposal[field]) {
        throw new Error(`Missing field in AI response: ${field}`);
      }
    }

    // Save to Supabase
    const { data, error } = await supabase
      .from("searches")
      .insert([
        {
          user_query: query,
          venue_name: proposal.venue_name,
          location: proposal.location,
          estimated_cost: proposal.estimated_cost,
          why_it_fits: proposal.why_it_fits,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json(data);
  } catch (err) {
    console.error("Error in /suggest:", err.message);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
});

// GET /api/history — return all past searches newest first
router.get("/history", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("searches")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (err) {
    console.error("Error in /history:", err.message);
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
});

export default router;
