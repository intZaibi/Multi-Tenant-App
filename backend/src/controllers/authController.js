import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../config/db.js';

const login = async (req, res) => {
  const { email, password } = req.body;
  // Validate required fields
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Please provide your email and password." });
  }
  
  // if db is not accessable 
  if (req == undefined) return res.status(500).json({ error: "Something went wrong!" });

  try {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (!rows || rows.length === 0) return res.status(404).json({ error: "Email not found!" });
  if (!(await bcrypt.compare(password, rows[0].password))) return res.status(401).json({ error: "Invalid credentials!" });
  
  // Generate JWT token.
  const accessToken = jwt.sign(
    { userId: rows[0].user_id, role: rows[0].role, tenantId: rows[0].tenant_id },
    process.env.JWT_SECRET || "enc",
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { userId: rows[0].user_id, role: rows[0].role, tenantId: rows[0].tenant_id },
    process.env.JWT_SECRET || "enc",
    { expiresIn: '30d' }
  );

  const [result] = await db.query('INSERT INTO user_sessions (user_id, refresh_token) VALUES (?, ?)', [rows[0].user_id, refreshToken]);
  if (result.affectedRows === 0) {
    console.log('db result: ', result)
    throw new Error("Token updation failed!");
  } 

    // Set token as an HTTP-only cookie
  res.cookie('accessToken', accessToken, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000,
    path: '/'
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000 * 24 * 30,
    path: '/'
  });

  res.status(200).json( {message: 'Login successful!', user: { userId: rows[0].user_id, first_name: rows[0].first_name, last_name: rows[0].last_name, email: rows[0].email, role: rows[0].role, accessToken, refreshToken }});
  } catch (error) {
    console.log('db updation failed!', error)
    return res.status(500).json({ error: "Something went wrong!" });
  }
};



const register = async (req, res) => {

  const { name, last_name, email, password, role, tenantId = 1 } = req.body;
  if (!name || !email || !password || !role ) return res.status(400).json({ error: "Please provide your first name, last name, email, password, role." });
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows && rows.length > 0) return res.status(400).json({ error: "Email already exists!" });
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query('INSERT INTO users (first_name, last_name, email, password, role, tenant_id) VALUES (?, ?, ?, ?, ?, ?)', [name, last_name || '', email, hashedPassword, role, tenantId]); 
    if (result.affectedRows === 0) {
      return res.status(500).json({ error: "Registration failed!" });
    }

    const accessToken = jwt.sign(
      { userId: result.insertId, role, tenantId },
      process.env.JWT_SECRET || "enc",
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { userId: result.insertId, role, tenantId },
      process.env.JWT_SECRET || "enc",
      { expiresIn: '30d' }
    );

    const [result2] = await db.query('INSERT INTO user_sessions (user_id, refresh_token) VALUES (?, ?)', [result.insertId, refreshToken]);
    if (result2.affectedRows === 0) {
      return res.status(500).json({ error: "Token updation failed!" });
    }

    res.cookie('accessToken', accessToken, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
      path: '/'
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000 * 24 * 30,
      path: '/'
    });

    res.status(200).json({message: 'Registration successful!', user: { name, last_name: last_name || '', email, role, tenantId, accessToken, refreshToken }});
    
  } catch (error) {
    console.log('db updation failed!', error)
    return res.status(500).json({ error: "Something went wrong!" });
  }
}



const refresh = async (req, res) => {
  
  const token = req.token;
  jwt.verify(token, process.env.JWT_SECRET || "enc", (err, decoded) => {
    if (err && err.message.includes('expired')) {
      console.log("Token expired!"); 
      return res.status(401).json({ error: 'Unauthorized! Token expired.' });
    }
    else if (err) { 
      console.log(err)
      return res.status(401).json({ error: 'Unauthorized! Token verification failed.' });
    }
  });

  try {
    const [rows] = await db.query('SELECT user_id FROM user_sessions WHERE refresh_token = ?', [token]);
    if (!rows || rows.length === 0) {
      return res.clearCookie('accessToken').clearCookie('refreshToken').status(401).json({ error: "Unauthorized! Token is not valid!" });
    }

    const [user] = await db.query('SELECT * FROM users WHERE user_id = ?', [rows[0].user_id]);

    const newAccessToken = jwt.sign(
      {userId: user[0].user_id, role: user[0].role, tenantId: user[0].tenant_id},
      process.env.JWT_SECRET || "enc",
      { expiresIn: '1h' }
    );

    const newRefreshToken = jwt.sign(
      {userId: user[0].user_id, role: user[0].role, tenantId: user[0].tenant_id},
      process.env.JWT_SECRET || "enc",
      { expiresIn: '30d' }
    );

    const [updateResult] = await db.query('INSERT INTO user_sessions (user_id, refresh_token) VALUES (?, ?)', [user[0].user_id, newRefreshToken]);
    if (updateResult.affectedRows === 0) {
      return res.status(500).json({ error: "Token update failed!" });
    }

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
      path: '/'
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000 * 24 * 30,
      path: '/'
    });
    
    res.status(200).json({message: 'Token refreshed successfully!', user: { userId: user[0].user_id, first_name: user[0].first_name, last_name: user[0].last_name, email: user[0].email, role: user[0].role, tenantId: user[0].tenant_id, accessToken: newAccessToken, refreshToken: newRefreshToken }});

  } catch (error) {
    console.error('Database update failed:', error);
    return res.status(500).json({ error: "Something went wrong!" });
  }

};



const logout = async (req, res) => {
  
  try {
    const [rows] = await db.query('SELECT user_id FROM user_sessions WHERE refresh_token = ?', [req.token]);
    if (!rows || rows.length === 0) {
      res.clearCookie('accessToken').clearCookie('refreshToken').status(401).json({ error: "Unauthorized! Token is not valid!" });
      return
    }

    const [updateResult] = await db.query('UPDATE user_sessions SET refresh_token = ? WHERE user_id = ?', ['', rows[0].user_id]);
  if (updateResult.affectedRows === 0) {
    return res.status(500).json({ error: "Logout failed!" });
  }
  return res.clearCookie('accessToken').clearCookie('refreshToken').status(200).json({message: 'Logged out successfully'});
  
  } catch (error) {
    console.log('db updation failed!')
    return res.status(500).json({ error: "Something went wrong!" });
  }

}


const getUser = async (req, res) => {
  try {
    
  const [rows] = await db.query('SELECT user_id, first_name, last_name, email, role, tenant_id FROM users WHERE user_id = ?', [req.user.userId]);
  console.log("rows: ", rows)
  if (!rows || rows.length === 0) {
    return res.status(401).json({ error: "Unauthorized! Token is not valid!" });
  }

    res.status(200).json( {message: 'User fetched successfully!', user: { 
      user_id: rows[0].user_id, 
      first_name: rows[0].first_name, 
      last_name: rows[0].last_name, 
      email: rows[0].email, 
      role: rows[0].role, 
      tenant_id: rows[0].tenant_id 
    }});
  } catch (error) {
    console.log('getUser error:', error)
    return res.status(500).json({ error: "Something went wrong!" });
  }
}

const getTenants = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name, display_name FROM tenants ORDER BY created_at DESC');
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
};

export {login, register, refresh, logout, getUser, getTenants};