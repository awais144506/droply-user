"use client";

import { useState } from "react";
import {
  Users,
  UserCheck,
  Bike,
  ShieldCheck,
  Plus,
  Search,
  Mail,
  Phone,
  Pencil,
  Trash2,
  Lock,
  Sparkles,
  MapPin,
  X,
  CheckCircle2,
  XCircle,
} from "lucide-react";

// --- TYPES ---
export type BranchUserRole = "MANAGER" | "RIDER";
export type BranchUserStatus = "ACTIVE" | "INACTIVE";

export interface BranchStaffItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: BranchUserRole;
  status: BranchUserStatus;
  assignedZones: { id: string; name: string }[];
  joinedAt: string;
}

// --- DUMMY DATA ---
const MOCK_SEAT_LIMIT = 10;

const MOCK_AVAILABLE_ZONES = [
  { id: "z1", name: "Airline Housing Society" },
  { id: "z2", name: "Fazaia Phase 1" },
  { id: "z3", name: "Wapda Town Sec A & B" },
  { id: "z4", name: "Gulberg Greens Sector D" },
];

const MOCK_STAFF_LIST: BranchStaffItem[] = [
  {
    id: "u-1",
    name: "Kamran Akmal",
    email: "kamran.ops@droply.pk",
    phone: "+92 300 5544332",
    role: "MANAGER",
    status: "ACTIVE",
    assignedZones: [],
    joinedAt: "Jan 15, 2026",
  },
  {
    id: "u-2",
    name: "Majid Ali",
    email: "majid.rider@droply.pk",
    phone: "+92 321 4455667",
    role: "RIDER",
    status: "ACTIVE",
    assignedZones: [
      { id: "z1", name: "Airline Housing Society" },
      { id: "z2", name: "Fazaia Phase 1" },
    ],
    joinedAt: "Feb 02, 2026",
  },
  {
    id: "u-3",
    name: "Usman Tariq",
    email: "usman.t@droply.pk",
    phone: "+92 301 9876543",
    role: "RIDER",
    status: "ACTIVE",
    assignedZones: [{ id: "z1", name: "Airline Housing Society" }],
    joinedAt: "Mar 10, 2026",
  },
  {
    id: "u-4",
    name: "Bilal Hussain",
    email: "bilal.ops@droply.pk",
    phone: "+92 333 7788991",
    role: "MANAGER",
    status: "ACTIVE",
    assignedZones: [],
    joinedAt: "Apr 21, 2026",
  },
  {
    id: "u-5",
    name: "Zeeshan Haider",
    email: "zeeshan.r@droply.pk",
    phone: "+92 312 6655443",
    role: "RIDER",
    status: "INACTIVE",
    assignedZones: [{ id: "z3", name: "Wapda Town Sec A & B" }],
    joinedAt: "May 04, 2026",
  },
];

export default function BranchUsersPage() {
  const [users, setUsers] = useState<BranchStaffItem[]>(MOCK_STAFF_LIST);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | BranchUserRole>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | BranchUserStatus>("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<BranchStaffItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    role: BranchUserRole;
    assignedZoneIds: string[];
  }>({
    name: "",
    email: "",
    phone: "",
    role: "RIDER",
    assignedZoneIds: [],
  });

  // Capacity & Seat Calculations
  const activeStaffCount = users.filter((u) => u.status === "ACTIVE").length;
  const maxSeats = MOCK_SEAT_LIMIT;
  const seatsUsedPercentage = Math.min(Math.round((activeStaffCount / maxSeats) * 100), 100);
  const isSeatLimitReached = activeStaffCount >= maxSeats;

  // Breakdown Counts
  const totalManagers = users.filter((u) => u.role === "MANAGER").length;
  const totalRiders = users.filter((u) => u.role === "RIDER").length;

  // Filtered Directory
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);

    if (!matchesSearch) return false;
    if (roleFilter !== "ALL" && user.role !== roleFilter) return false;
    if (statusFilter !== "ALL" && user.status !== statusFilter) return false;

    return true;
  });

  // Handlers
  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "RIDER",
      assignedZoneIds: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: BranchStaffItem) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      assignedZoneIds: user.assignedZones.map((z) => z.id),
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus: BranchUserStatus = u.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = (userId: string) => {
    if (!confirm("Are you sure you want to remove this staff member?")) return;
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;

    const mappedZones = MOCK_AVAILABLE_ZONES.filter((z) =>
      formData.assignedZoneIds.includes(z.id)
    );

    if (editingUser) {
      // Update
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                role: formData.role,
                assignedZones: formData.role === "RIDER" ? mappedZones : [],
              }
            : u
        )
      );
    } else {
      // Create
      if (isSeatLimitReached) {
        alert("Branch seat limit reached. Please upgrade your plant subscription.");
        return;
      }
      const newUser: BranchStaffItem = {
        id: `u-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: "ACTIVE",
        assignedZones: formData.role === "RIDER" ? mappedZones : [],
        joinedAt: "Today",
      };
      setUsers((prev) => [newUser, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Branch Staff & Fleet
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage operational managers, delivery riders, login permissions, and zone route coverage.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          disabled={isSeatLimitReached}
          className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Seat Capacity Progress Bar & Metric Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {/* Progress Bar Card (Seat Limit) */}
        <div className="lg:col-span-2 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
                  <Users className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold text-slate-900">Branch Seat Capacity</span>
              </div>
              <span
                className={`text-xs font-bold ${
                  isSeatLimitReached
                    ? "text-rose-600"
                    : seatsUsedPercentage >= 80
                    ? "text-amber-600"
                    : "text-slate-700"
                }`}
              >
                {activeStaffCount} / {maxSeats} Active Seats
              </span>
            </div>

            {/* Visual Bar */}
            <div className="mt-3.5 h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isSeatLimitReached
                    ? "bg-rose-500"
                    : seatsUsedPercentage >= 80
                    ? "bg-amber-500"
                    : "bg-sky-600"
                }`}
                style={{ width: `${seatsUsedPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-[11px]">
            <span className="text-slate-500">
              {maxSeats - activeStaffCount} seat slots remaining in this tier
            </span>
            <button className="text-sky-600 font-semibold hover:underline inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>Upgrade Plan</span>
            </button>
          </div>
        </div>

        {/* Manager Count Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Branch Managers
            </span>
            <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{totalManagers}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Web dashboard & ledger access</p>
          </div>
        </div>

        {/* Rider Count Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Delivery Fleet
            </span>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Bike className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{totalRiders}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Mobile route access</p>
          </div>
        </div>
      </div>

      {/* Directory Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Filters & Search Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* High-Contrast Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search staff by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
            {/* Role Filter */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
              <button
                onClick={() => setRoleFilter("ALL")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  roleFilter === "ALL" ? "bg-white text-slate-900 shadow-2xs font-semibold" : ""
                }`}
              >
                All Roles
              </button>
              <button
                onClick={() => setRoleFilter("MANAGER")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  roleFilter === "MANAGER" ? "bg-white text-slate-900 shadow-2xs font-semibold" : ""
                }`}
              >
                Managers
              </button>
              <button
                onClick={() => setRoleFilter("RIDER")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  roleFilter === "RIDER" ? "bg-white text-slate-900 shadow-2xs font-semibold" : ""
                }`}
              >
                Riders
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
              <button
                onClick={() => setStatusFilter("ALL")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === "ALL" ? "bg-white text-slate-900 shadow-2xs font-semibold" : ""
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("ACTIVE")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === "ACTIVE" ? "bg-white text-emerald-700 shadow-2xs font-semibold" : ""
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter("INACTIVE")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === "INACTIVE" ? "bg-white text-slate-700 shadow-2xs font-semibold" : ""
                }`}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Coverage (Zones)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* User Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-xl bg-sky-100/70 text-sky-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Mail className="h-2.5 w-2.5" />
                            <span className="truncate">{user.email}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-3 px-4 font-mono text-slate-600">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-slate-400" />
                        <span>{user.phone}</span>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="py-3 px-4">
                      {user.role === "MANAGER" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                          <ShieldCheck className="h-3 w-3" />
                          <span>Manager</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
                          <Bike className="h-3 w-3" />
                          <span>Rider</span>
                        </span>
                      )}
                    </td>

                    {/* Assigned Zones */}
                    <td className="py-3 px-4">
                      {user.role === "RIDER" ? (
                        user.assignedZones.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {user.assignedZones.map((z) => (
                              <span
                                key={z.id}
                                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                              >
                                <MapPin className="h-2.5 w-2.5 text-slate-400" />
                                <span>{z.name}</span>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">No assigned zones</span>
                        )
                      ) : (
                        <span className="text-[11px] text-slate-400">All Branch Operations</span>
                      )}
                    </td>

                    {/* Status Toggle Badge */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                          user.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                        title="Click to toggle status"
                      >
                        {user.status === "ACTIVE" ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 text-slate-400" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Edit staff details"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Remove user"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No staff members match the selected filters or search keyword.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">
                {editingUser ? "Edit Staff Member" : "Add Branch User"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Majid Ali"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Email Address *</label>
                <input
                  type="email"
                  placeholder="e.g. majid@droply.pk"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Phone Number *</label>
                <input
                  type="text"
                  placeholder="+92 300 0000000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  required
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Staff Role *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "RIDER" })}
                    className={`h-9 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      formData.role === "RIDER"
                        ? "bg-sky-50 border-sky-500 text-sky-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Bike className="h-3.5 w-3.5" />
                    <span>Delivery Rider</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "MANAGER" })}
                    className={`h-9 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      formData.role === "MANAGER"
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Plant Manager</span>
                  </button>
                </div>
              </div>

              {/* Zone Assignment (if Rider) */}
              {formData.role === "RIDER" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Assign Delivery Zones
                  </label>
                  <div className="max-h-32 overflow-y-auto space-y-1 border border-slate-200 rounded-xl p-2 bg-slate-50/50">
                    {MOCK_AVAILABLE_ZONES.map((zone) => {
                      const isAssigned = formData.assignedZoneIds.includes(zone.id);
                      return (
                        <div
                          key={zone.id}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              assignedZoneIds: isAssigned
                                ? prev.assignedZoneIds.filter((id) => id !== zone.id)
                                : [...prev.assignedZoneIds, zone.id],
                            }));
                          }}
                          className={`flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                            isAssigned
                              ? "bg-sky-100/70 text-sky-900 font-medium"
                              : "hover:bg-slate-100 text-slate-600"
                          }`}
                        >
                          <span>{zone.name}</span>
                          <input
                            type="checkbox"
                            checked={isAssigned}
                            readOnly
                            className="rounded border-slate-300 text-sky-600 pointer-events-none"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-8 px-3 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors"
                >
                  {editingUser ? "Save Changes" : "Create Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}