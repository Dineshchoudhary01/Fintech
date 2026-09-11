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


async function generateBudgetAdvice(summary){
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash '});

    const summaryText = summary.map(item => 
      `${item.category}: spent ₹${item.spent} out of ₹${item.budgetLimit} budget (${item.percentageUsed}% used, ₹${item.remaining} remaining)`
    ).join('\n');

     const prompt = `You are a friendly personal finance advisor. Based on the following budget data for this month, give the user 2-3 short, specific, actionable pieces of advice. Be encouraging but honest about overspending. Keep the total response under 100 words.
       Budget data:
${summaryText}

Give practical advice based on this data only.`;

   const result = await model.generateContent(prompt);
   const response = result.response;

   return response.text().trim();

  } catch (error) {
    console.log('Budget advice generation failed:', error.message);
    return "Unable to generate advice at this time.";
  }
}

module.exports = { categorizeTransaction, generateBudgetAdvice };