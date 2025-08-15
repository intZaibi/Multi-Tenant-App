import { Router } from 'express';

const router = Router();

import { login, register, refresh, logout, getUser, getTenants } from '../controllers/authController.js';

router.post('/login', login);
router.post('/register', register);
router.get('/refresh', refresh); 
router.get('/logout', logout);
router.get('/get-user', getUser);
router.get('/tenants', getTenants);


export default router;