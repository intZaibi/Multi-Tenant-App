import { Router } from 'express';

const router = Router();

import { login, register, refresh, logout, getUser } from '../controllers/authController.js';

router.post('/login', login);
router.post('/register', register);
router.get('/refresh', refresh); 
router.get('/logout', logout);
router.get('/get-user', getUser);

export default router;