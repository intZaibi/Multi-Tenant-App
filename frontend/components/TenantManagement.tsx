'use client';

import { useState, useEffect } from 'react';
import { InputField } from "./ui/InputField";
import { Building, Plus, Trash2, Calendar, Loader2 } from "lucide-react";
import { getTenants, createTenant, deleteTenant } from "../services/api";
import { Button } from './ui/button';

interface Tenant {
  id: number;
  name: string;
  created_at: string;
  user_count?: number;
}

export default function TenantManagement() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", subdomain: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const response = await getTenants();
      if (response.error) {
        setError(response.error);
      } else {
        setTenants(response.tenants || []);
      }
    } catch (error) {
      setError("Failed to fetch tenants");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.name || !formData.subdomain) {
      setError("Please fill in all fields");
      return false;
    }
    const regex = /^[a-zA-Z0-9 ]+$/;
    if (!regex.test(formData.name)) {
      setError("Name can only contain letters, numbers, and spaces");
      return false;
    }
    const regex2 = /^[a-z0-9]+$/;
    if (!regex2.test(formData.subdomain)) {
      setError("Subdomain can only contain lowercase letters, numbers, and hyphens");
      return false;
    }
    return true;
  }

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // optimistic update
    const newTenant = { id: tenants.length + 1, name: formData.name, created_at: new Date().toISOString() };
    const previousTenants = [...tenants];
    setTenants([...tenants, newTenant]);
    setShowCreateForm(false);
    setError("");

    try {
      const response = await createTenant(formData.name, formData.subdomain);
      if (response.error) {
        setError(response.error);
      } else {
        setTenants((prev) => prev.map((tenant) => tenant.id === newTenant.id ? { ...tenant, id: response.tenant.insertId } : tenant));
      }
    } catch (error) {
      setTenants(previousTenants);
      setError("Failed to create tenant");
    } finally {
      setFormData({ name: "", subdomain: "" });
    }
  };

  const handleDeleteTenant = async (id: number) => {
    // optimistic update
    const previousTenants = [...tenants];
    setTenants(tenants.filter((tenant) => tenant.id !== id));
    try {
      await deleteTenant(id);
    } catch (error) {
      setTenants(previousTenants);
      setError("Failed to delete tenant");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tenant Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your application tenants</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Tenant
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Create Tenant Form */}
      {showCreateForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Tenant</h2>
          <form onSubmit={handleCreateTenant} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                required
                icon={Building}
                placeholder="Tenant Name (e.g., Acme Corp)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                title="Only letters, numbers, and spaces"
              />
              <InputField
                required
                icon={Building}
                placeholder="Tenant Subdomain (e.g., acme-corp)"
                value={formData.subdomain}
                onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                title="Lowercase letters, numbers, and hyphens only"
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Tenant"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({ name: "", subdomain: "" });
                  setError("");
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Tenants List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Tenants</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {tenants.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
              <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No tenants found. Create your first tenant to get started.</p>
            </div>
          ) : (
            tenants.map((tenant, index) => (
              <div key={index} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                          {tenant.id} - {tenant.name}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="w-3 h-3 mr-1" />
                            Created {new Date(tenant.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        onClick={() => handleDeleteTenant(tenant.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
