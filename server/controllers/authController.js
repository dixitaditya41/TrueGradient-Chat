import User from '../models/User.js';
import Organization from '../models/Organization.js';
import { OAuth2Client } from "google-auth-library";
import { signToken,verifyToken } from '../utils/jwt.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if( !username || !email || !password){
        return res.status(400).json({ message: 'All fields are required' });
    }
  
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: 'Email already exists' });
  
    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ message: 'Username already exists' });
  
    if(username.length < 3){        
        return res.status(400).json({ message: 'Username must be at least 3 characters long' });
    }
  
    // Password length check
    if(password.length < 6){        
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
  
    // Password complexity check: lowercase, uppercase, special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/;
    if(!passwordRegex.test(password)){
        return res.status(400).json({ 
          message: 'Password must contain at least 1 lowercase letter, 1 uppercase letter, and 1 special character' 
        });
    }
  
    if(!/^[a-zA-Z0-9_]+$/.test(username)){
        return res.status(400).json({ message: 'Username can only contain letters, numbers, and underscores' });
    }
  
    const user = await User.create({
      username,
      email,
      password
    });
  
    const defaultOrg = await Organization.create({
      name: `${username}'s Workspace`,
      members: [{ user: user._id, role: 'admin' }]
    });
  
    user.organizations.push(defaultOrg._id);
    user.activeOrganization = defaultOrg._id;
    await user.save();
  
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      activeOrganization: defaultOrg,
      organizations: [defaultOrg],
      credits: user.credits,
      token: signToken({ id: user._id })
    });
  
  } catch (err) {
    console.error(err);
    // Cleanup in case of error
    if (user?._id) await User.findByIdAndDelete(user._id);
    if (defaultOrg?._id) await Organization.findByIdAndDelete(defaultOrg._id);
    res.status(500).json({ message: 'Server error' });
  }
  
};

const login = async (req, res) => {
  
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    
    const token = signToken({ id: user._id });
    
    // Populate organizations and activeOrganization
    const populatedUser = await User.findById(user._id)
      .populate('activeOrganization', 'name _id')
      .populate('organizations', 'name _id');

    res.json({
      _id: populatedUser._id,
      username: populatedUser.username,
      email: populatedUser.email,
      activeOrganization: populatedUser.activeOrganization,
      organizations: populatedUser.organizations,
      token,
      credits: populatedUser.credits,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const googleAuth = async (req, res) => {
  try {
    const { token } = req.body; // Google ID token from frontend
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email,sub } = payload;
    let username = email.split("@")[0];

    // ensure username is unique
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      username = `${username}_${Math.floor(Math.random() * 10000)}`;
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        username,
        googleId: sub,
        authProvider: "google",
      });

      // create default organization
      const defaultOrg = await Organization.create({
        name: `${username}'s Workspace`,
        members: [{ user: user._id, role: "admin" }],
      });

      user.organizations.push(defaultOrg._id);
      user.activeOrganization = defaultOrg._id;
      await user.save();
    }

    const jwtToken = signToken({ id: user._id, email: user.email });
    
    // Populate organizations and activeOrganization
    const populatedUser = await User.findById(user._id)
      .populate('activeOrganization', 'name _id')
      .populate('organizations', 'name _id');

    res.status(200).json({
      _id: populatedUser._id,
      username: populatedUser.username,
      email: populatedUser.email,
      activeOrganization: populatedUser.activeOrganization,
      organizations: populatedUser.organizations,
      token: jwtToken,
      credits: populatedUser.credits,
    });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(500).json({ message: "Google authentication failed" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id; 
    const user = await User.findById(userId)
      .select("-password")
      .populate('activeOrganization', 'name _id')
      .populate('organizations', 'name _id');
    
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      credits: user.credits,
      activeOrganization: user.activeOrganization,
      organizations: user.organizations
    });
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export{
    signup,
    login,
    googleAuth,
    getCurrentUser,
}