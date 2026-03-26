import Resume from "../models/Resume.js";
import {ai} from "../configs/ai.js"


export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = `
You are an expert in resume writing.
Enhance the following professional summary.
Your output must be:
- Only 1–2 sentences
- Strong and ATS-friendly
- Highlight key skills, experience, and career objectives
- Return ONLY the improved summary text. No explanations, no bullet points.

Summary:
${userContent}
`;

    const response = await ai.chat.completions.create({
      model: "llama-3.1-8b-instant", // ✅ free + fast
      messages: [
        { role: "system", content: "You are a helpful AI assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const enhancedContent = response.choices[0].message.content;

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("Groq Enhance Summary Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = `
You are an expert in resume writing.
Enhance the following job description.

Requirements for the output:
- Only 1–2 sentences
- Highlight key responsibilities and achievements
- Use action verbs
- Include quantifiable results when possible
- Make it ATS-friendly
- Return ONLY the improved job description text. No explanation, no bullets.

Job Description:
${userContent}
`;

    const response = await ai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a professional resume assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const enhancedContent = response.choices[0].message.content;

    return res.status(200).json({ enhancedContent });

  } catch (error) {
    console.error("Groq Job Description Error:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = `
You are an expert AI agent that extracts structured data from resume text.

Return ONLY a valid JSON object. No explanation, no markdown.

Resume Text:
${resumeText}

STRICT JSON FORMAT:
{
  "professional_summary": "",
  "skills": [],
  "personal_info": {
    "image": "",
    "full_name": "",
    "profession": "",
    "email": "",
    "phone": "",
    "location": ""
  },
  "experience": [
    {
      "company": "",
      "position": "",
      "start_date": "",
      "end_date": "",
      "description": "",
      "is_current": false
    }
  ],
  "project": [
    {
      "name": "",
      "type": "",
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "graduation_date": "",
      "gpa": ""
    }
  ]
}
`;

    const response = await ai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a JSON generator." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2, // 🔥 important for JSON stability
    });

    let extracted = response.choices[0].message.content;

    // 🧠 Clean response (VERY IMPORTANT)
    extracted = extracted.replace(/```json|```/g, "").trim();

    const parsedData = JSON.parse(extracted);

    const newResume = await Resume.create({
      userId,
      title,
      ...parsedData,
    });

    res.status(200).json({ resumeId: newResume._id });

  } catch (error) {
    console.error("Groq Resume Error:", error);
    res.status(400).json({ message: error.message });
  }
};

