import { Router } from 'express';

const router = Router();

import { getTenants, getTenantById, createTenant, deleteTenant } from '../controllers/tenantController.js';
import { superadminAuth } from '../middleware/superadminAuth.js';

router.get('/get-tenants', getTenants);
router.get('/get-tenant/:id', getTenantById);
router.post('/create-tenant', superadminAuth, createTenant);
router.delete('/delete-tenant/:id', superadminAuth, deleteTenant);


export default router;
