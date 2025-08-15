import { Router } from 'express';
import { createTenant, getTenants, updateTenant, deleteTenant } from '../controllers/tenantController.js';
import { authenticateToken, requireSuperAdmin } from '../middleware/auth.js';

const router = Router();

// All tenant routes require authentication
router.use(authenticateToken);

// Get all tenants (accessible by super admin only)
router.get('/', requireSuperAdmin, getTenants);

// Create new tenant (accessible by super admin only)
router.post('/', requireSuperAdmin, createTenant);

// Update tenant (accessible by super admin only)
router.put('/:id', requireSuperAdmin, updateTenant);

// Delete tenant (accessible by super admin only)
router.delete('/:id', requireSuperAdmin, deleteTenant);

export default router;
