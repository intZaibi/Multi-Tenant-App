'use server';
// import path from "path";
// import fs from "fs";
// export async function getTenants() {
//   const fs = await import('fs');
//   const path = await import('path');
//   const tenantsPath = path.join(process.cwd(), 'tenants.json');
//   const tenants = JSON.parse(fs.readFileSync(tenantsPath, 'utf8'));
//   return tenants;
// }

export async function insertTenant(id: number, name: string, subdomain: string) {
  const fs = await import('fs');
  const path = await import('path');
  const tenantsPath = path.join(process.cwd(), 'tenants.json');
  const tenants = JSON.parse(fs.readFileSync(tenantsPath, 'utf8'));
  const newTenant = {
    id,
    name,
    subdomain: subdomain
  };
  tenants.push(newTenant);
  fs.writeFileSync(tenantsPath, JSON.stringify(tenants, null, 2));
  console.log("New Tenant from frontend: name, subdomain", newTenant)
  return tenants;
}

export async function deleteTenant(id: number) {
  const fs = await import('fs');
  const path = await import('path');
  const tenantsPath = path.join(process.cwd(), 'tenants.json');
  const tenants = JSON.parse(fs.readFileSync(tenantsPath, 'utf8'));
  const newTenants = tenants.filter((tenant: any) => tenant.id !== id);
  fs.writeFileSync(tenantsPath, JSON.stringify(newTenants, null, 2));
  console.log("Deleted Tenant from frontend: ", newTenants);
  return newTenants;
}