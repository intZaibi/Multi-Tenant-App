'use server';
import path from "path";
import fs from "fs";
export async function getTenants() {
  const tenantsPath = path.join(process.cwd(), 'tenants.json');
  const tenants = JSON.parse(fs.readFileSync(tenantsPath, 'utf8'));
  return tenants;
}

export async function insertTenant(id: number, name: string, subdomain: string) {
  const tenantsPath = path.join(process.cwd(), 'tenants.json');
  const tenants = JSON.parse(fs.readFileSync(tenantsPath, 'utf8'));
  console.log("name, subdomain", name, subdomain)
  const newTenant = {
    id,
    name,
    subdomain: subdomain
  };
  tenants.push(newTenant);
  fs.writeFileSync(tenantsPath, JSON.stringify(tenants, null, 2));
  return tenants;
}

export async function deleteTenant(id: number) {
  const tenantsPath = path.join(process.cwd(), 'tenants.json');
  const tenants = JSON.parse(fs.readFileSync(tenantsPath, 'utf8'));
  console.log("tenants from deleteTenant: ", tenants);
  const newTenants = tenants.filter((tenant: any) => tenant.id !== id);
  fs.writeFileSync(tenantsPath, JSON.stringify(newTenants, null, 2));
  return newTenants;
}