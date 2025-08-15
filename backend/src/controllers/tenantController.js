import db from '../config/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to update tenants.json file
const updateTenantsJsonFile = async (tenants) => {
  try {
    const tenantsPath = path.join(__dirname, '../../../../frontend/tenants.json');
    await fs.promises.writeFile(tenantsPath, JSON.stringify(tenants, null, 2));
    console.log('✅ Tenants JSON file updated successfully');
  } catch (error) {
    console.error('❌ Error updating tenants JSON file:', error);
    throw new Error('Failed to update tenants configuration');
  }
};

// Get all tenants
export const getTenants = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tenants ORDER BY created_at DESC');
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
};

// Create new tenant
export const createTenant = async (req, res) => {
  const { name, displayName } = req.body;

  // Validate required fields
  if (!name || !displayName) {
    return res.status(400).json({ error: 'Name and display name are required' });
  }

  // Validate name format (alphanumeric and hyphens only)
  if (!/^[a-z0-9-]+$/.test(name)) {
    return res.status(400).json({ error: 'Tenant name must contain only lowercase letters, numbers, and hyphens' });
  }

  try {
    // Check if tenant name already exists
    const [existingTenants] = await db.query('SELECT * FROM tenants WHERE name = ?', [name]);
    if (existingTenants.length > 0) {
      return res.status(400).json({ error: 'Tenant name already exists' });
    }

    // Insert new tenant into database
    const [result] = await db.query(
      'INSERT INTO tenants (name, display_name) VALUES (?, ?)',
      [name, displayName]
    );

    if (result.affectedRows === 0) {
      return res.status(500).json({ error: 'Failed to create tenant' });
    }

    // Get the newly created tenant
    const [newTenant] = await db.query('SELECT * FROM tenants WHERE id = ?', [result.insertId]);

    // Update tenants.json file
    const [allTenants] = await db.query('SELECT * FROM tenants ORDER BY created_at DESC');
    const tenantsForJson = allTenants.map(tenant => ({
      id: tenant.id,
      name: tenant.name,
      displayName: tenant.display_name,
      createdAt: tenant.created_at
    }));

    await updateTenantsJsonFile(tenantsForJson);

    res.status(201).json({ 
      message: 'Tenant created successfully',
      data: newTenant[0]
    });
  } catch (error) {
    console.error('Error creating tenant:', error);
    res.status(500).json({ error: 'Failed to create tenant' });
  }
};

// Update tenant
export const updateTenant = async (req, res) => {
  const { id } = req.params;
  const { name, displayName } = req.body;

  if (!name || !displayName) {
    return res.status(400).json({ error: 'Name and display name are required' });
  }

  if (!/^[a-z0-9-]+$/.test(name)) {
    return res.status(400).json({ error: 'Tenant name must contain only lowercase letters, numbers, and hyphens' });
  }

  try {
    // Check if tenant exists
    const [existingTenant] = await db.query('SELECT * FROM tenants WHERE id = ?', [id]);
    if (existingTenant.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    // Check if new name conflicts with existing tenant
    const [nameConflict] = await db.query('SELECT * FROM tenants WHERE name = ? AND id != ?', [name, id]);
    if (nameConflict.length > 0) {
      return res.status(400).json({ error: 'Tenant name already exists' });
    }

    // Update tenant
    const [result] = await db.query(
      'UPDATE tenants SET name = ?, display_name = ? WHERE id = ?',
      [name, displayName, id]
    );

    if (result.affectedRows === 0) {
      return res.status(500).json({ error: 'Failed to update tenant' });
    }

    // Update tenants.json file
    const [allTenants] = await db.query('SELECT * FROM tenants ORDER BY created_at DESC');
    const tenantsForJson = allTenants.map(tenant => ({
      id: tenant.id,
      name: tenant.name,
      displayName: tenant.display_name,
      createdAt: tenant.created_at
    }));

    await updateTenantsJsonFile(tenantsForJson);

    res.status(200).json({ 
      message: 'Tenant updated successfully',
      data: { id, name, displayName }
    });
  } catch (error) {
    console.error('Error updating tenant:', error);
    res.status(500).json({ error: 'Failed to update tenant' });
  }
};

// Delete tenant
export const deleteTenant = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if tenant exists
    const [existingTenant] = await db.query('SELECT * FROM tenants WHERE id = ?', [id]);
    if (existingTenant.length === 0) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    // Check if there are users associated with this tenant
    const [usersInTenant] = await db.query('SELECT COUNT(*) as count FROM users WHERE tenant_id = ?', [id]);
    if (usersInTenant[0].count > 0) {
      return res.status(400).json({ error: 'Cannot delete tenant with associated users' });
    }

    // Delete tenant
    const [result] = await db.query('DELETE FROM tenants WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(500).json({ error: 'Failed to delete tenant' });
    }

    // Update tenants.json file
    const [allTenants] = await db.query('SELECT * FROM tenants ORDER BY created_at DESC');
    const tenantsForJson = allTenants.map(tenant => ({
      id: tenant.id,
      name: tenant.name,
      displayName: tenant.display_name,
      createdAt: tenant.created_at
    }));

    await updateTenantsJsonFile(tenantsForJson);

    res.status(200).json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    console.error('Error deleting tenant:', error);
    res.status(500).json({ error: 'Failed to delete tenant' });
  }
};
