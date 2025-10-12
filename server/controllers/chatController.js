import Chat from '../models/Chat.js';
import { gptApiResults } from '../services/gemini.js';
import asyncHandler from '../middleware/asyncHandler.js';

const sendMessage = asyncHandler(async (req, res) => {
  const user = req.user;
  const { message } = req.body;
  const orgId = user.activeOrganization;

  if (!message || message.trim() === '') {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Calculate tokens based on message length
  const userTokens = message.length; 
  
  if (user.credits < userTokens) {
    return res.status(403).json({ error: 'Insufficient credits' });
  }

  // Fetch previous chat history for this user/org
  let chat = await Chat.findOne({ user: user._id, organization: orgId });
  if (!chat) {
    chat = new Chat({ user: user._id, organization: orgId, messages: [] });
  }

  // Construct prompt with previous chat history if any
  const historyPrompt = chat.messages
    .map(m => `${m.role}: ${m.content}`)
    .join('\n');
  

  const finalPrompt = historyPrompt 
    ? `${historyPrompt}\nuser: ${message}`
    : `user: ${message}`;
  
  try {
 
    const geminiResponse = await gptApiResults(finalPrompt);
    const assistantMessage = geminiResponse.response;
    
    if (!assistantMessage) {
      throw new Error("No response from Gemini API");
    }

    chat.messages.push({ 
      role: 'user', 
      content: message, 
      tokensUsed: userTokens 
    });
    
    chat.messages.push({ 
      role: 'assistant', 
      content: assistantMessage,
    });
    
    await chat.save();

    user.credits -= userTokens;
    await user.save();

    res.json({ 
      message: assistantMessage, 
      tokensUsed: userTokens, 
      remainingCredits: user.credits 
    });
    
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      details: error.message 
    });
  }
});

const getChatHistory = asyncHandler(async (req, res) => {
  const user = req.user;
  const orgId = user.activeOrganization;

  const chat = await Chat.findOne({ user: user._id, organization: orgId });
  
  if (!chat) {
    return res.json({ messages: [] });
  }

  res.json({ messages: chat.messages });
});

export {
  sendMessage, 
  getChatHistory
};