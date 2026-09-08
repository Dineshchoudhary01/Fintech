const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function categorizeTransaction(description, categoryList) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    const prompt = `You are a financial transaction categorizer.
Given a transaction description, pick the SINGLE most appropriate category from this list: ${categoryList.join(', ')}.

Transaction description: "${description}"

Reply with ONLY the category name from the list, nothing else. No explanation, no punctuation.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const categoryName = response.text().trim();

    return categoryName;

  } catch (error) {
    console.log('AI categorization failed:', error.message);
    return null;
  }
}

module.exports = { categorizeTransaction };