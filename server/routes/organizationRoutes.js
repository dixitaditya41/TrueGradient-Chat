import express from 'express';
import {
  getUserOrganizations,
  createOrganization,
  switchOrganization,
  inviteMember,
  renameOrganization
} from '../controllers/organizationController.js';
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.use(authMiddleware);

router.route('/')
  .get(getUserOrganizations);

router.route('/create')
  .post(createOrganization);

router.route('/:orgId/switch')
  .post(switchOrganization);

router.route('/:orgId/invite')
  .post(inviteMember);

router.route('/:orgId/rename')
  .patch(renameOrganization);

export default router;
