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

    const model = ai.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const result = await model.generateContent(prompt);
    const enhancedContent = result.response.text(); // Gemini returns plain text

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("Gemini Enhance Summary Error:", error);
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

    const model = ai.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    
    const result = await model.generateContent(prompt);
    console.log("description1111",result)

    const enhancedContent = result.response.text();

    console.log("descriptionsjsjhsd1111",enhancedContent)

    return res.status(200).json({ enhancedContent });
  } catch (error) {
    console.error("Gemini Job Description Error:", error);
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

    // System + user prompt merged for Gemini
    const prompt = `
    You are an expert AI agent that extracts structured data from resume text.
    Read the resume below and return ONLY a valid JSON object. No extra text.

    Resume Text:
    ${resumeText}

    JSON Format to Follow:
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

    console.log("Calling Gemini 2.0 Flash...");

    const model = ai.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json"  // forces JSON output
      }
    });

    const result = await model.generateContent(prompt);

    const extracted = result.response.text();

    const parsedData = JSON.parse(extracted);

    const newResume = await Resume.create({ userId, title, ...parsedData });

    res.status(200).json({ resumeId: newResume._id });
  } catch (error) {
    console.error("Gemini Resume Error:", error);
    res.status(400).json({ message: error.message });
  }
};

