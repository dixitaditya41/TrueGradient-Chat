import Organization from '../models/Organization.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { sendTargetNotification ,sendGlobalNotification} from '../utils/socket.js';

const getUserOrganizations = async (req, res) => {
  try {
    const user = req.user;
    const orgs = await Organization.find({ _id: { $in: user.organizations } });
    res.json(orgs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

 const createOrganization = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Organization name required' });

    const org = await Organization.create({
      name,
      members: [{ user: req.user._id, role: 'admin' }]
    });

    req.user.organizations.push(org._id);
    req.user.activeOrganization = org._id;
    await req.user.save();

    res.status(201).json(org);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

 const switchOrganization = async (req, res) => {
  try {
    const { orgId } = req.params;
    if (!orgId || !mongoose.Types.ObjectId.isValid(orgId)) return res.status(400).json({ error: 'Invalid orgId' });

    if (!req.user.organizations.includes(orgId)) return res.status(403).json({ error: 'Not a member of this organization' });

    req.user.activeOrganization = orgId;
    await req.user.save();

    res.json({ message: 'Switched active organization', activeOrganization: orgId });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const inviteMember = async (req, res) => {
  try {
      const { orgId } = req.params;
    const { email } = req.body;
    if (!orgId || !email) return res.status(400).json({ error: 'orgId and email required' });

    const org = await Organization.findById(orgId);
    if (!org) return res.status(404).json({ error: 'Organization not found' });

    const isAdmin = org.members.find(m => m.user.toString() === req.user._id.toString() && m.role === 'admin');
    if (!isAdmin) return res.status(403).json({ error: 'Only admins can invite members' });

    const invitedUser = await User.findOne({ email });
    if (!invitedUser) return res.status(404).json({ error: 'User with this email not found' });

    const alreadyMember = org.members.find(m => m.user.toString() === invitedUser._id.toString());
    if (alreadyMember) return res.status(400).json({ error: 'User already a member' });

    org.members.push({ user: invitedUser._id, role: 'member' });
     
    await org.save();

    invitedUser.organizations.push(org._id);
    await invitedUser.save();
    
     // send real-time notification to invited user
    await sendTargetNotification(invitedUser._id, `You have been invited to ${org.name}`);

    res.json({ message: 'Member invited successfully', org });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const renameOrganization = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { newName } = req.body;
    if (!orgId || !newName) return res.status(400).json({ error: 'orgId and newName required' });

    const org = await Organization.findById(orgId);
    if (!org) return res.status(404).json({ error: 'Organization not found' });

    const isAdmin = org.members.find(m => m.user.toString() === req.user._id.toString() && m.role === 'admin');
    if (!isAdmin) return res.status(403).json({ error: 'Only admins can rename the organization' });

    org.name = newName;
    await org.save();
    
    await sendGlobalNotification("Organization renamed to " + newName);
    
    res.json({ message: 'Organization renamed successfully', org });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export{
    getUserOrganizations,
    createOrganization,
    switchOrganization,
    inviteMember,
    renameOrganization
}