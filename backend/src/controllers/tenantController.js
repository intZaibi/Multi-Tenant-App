import db from '../config/db.js';

export const getTenants = async (req, res) => {
    try {
        const [tenants] = await db.query('SELECT * FROM tenants');
        if (!tenants || tenants.length === 0) {
            return res.status(404).json({ error: 'No tenants found' });
        }
        res.status(200).json({ message: 'Tenants fetched successfully!', tenants: tenants });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tenants' });
    }
}

export const getTenantById = async (req, res) => {
    try {
        const [tenant] = await db.query('SELECT * FROM tenants WHERE id = ?', [req.params.id]);
        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }
        res.status(200).json({ message: 'Tenant fetched successfully!', tenant: tenant });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tenant' });
    }
}

export const createTenant = async (req, res) => {
    try {
        const [rows] = await db.query('INSERT INTO tenants (name, subdomain) VALUES (?, ?)', [req.body.name, req.body.subdomain]);
        if (rows.affectedRows === 0) {
            return res.status(400).json({ error: 'Tenant not created' });
        }
        res.status(201).json({ message: 'Tenant created successfully!', tenant: rows });
    } catch (error) {
        console.log("error from create tenant: ", error);
        res.status(500).json({ error: 'Failed to create tenant' });
    }
}

export const deleteTenant = async (req, res) => {
    try {
        const [rows] = await db.query('DELETE FROM tenants WHERE id = ?', [req.params.id]);
        if (!rows.affectedRows === 0) {
            return res.status(400).json({ error: 'Tenant not deleted' });
        }
        res.status(200).json({ message: 'Tenant deleted successfully!', tenant: rows });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete tenant' });
    }
}
