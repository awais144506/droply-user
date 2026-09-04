import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export type StaffRole = "OWNER" | "MANAGER" | "RIDER";
export type AttendanceStatus = "PRESENT" | "ABSENT" | "HALF_DAY" | "LEAVE" | "NOT_MARKED";

export interface BranchUserItem {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  isActive: boolean;
  zones?: { id: string; name: string }[];
  todayAttendance: AttendanceStatus;
  checkInTime?: string | null;
  createdAt: string;
}
export interface AttendanceLog {
  date: string;
  status: AttendanceStatus;
  checkInTime: string | null;
}

export interface BranchUserItem {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  isActive: boolean;
  zones?: { id: string; name: string }[];
  todayAttendance: AttendanceStatus;
  checkInTime?: string | null;
  createdAt: string;
  attendanceHistory?: AttendanceLog[]; // New field for the detailed page
}

// Dummy data injected for UI testing before backend connection
export function useStaff(branchId: string) {
  return useQuery({
    queryKey: ["staff", branchId],
    queryFn: async (): Promise<BranchUserItem[]> => {
      return [
        {
          id: "u1", clerkId: "clk_1", name: "Muhammad Awais", email: "awais@droply.com", phone: "+92 300 1122334",
          role: "OWNER", isActive: true, todayAttendance: "PRESENT", checkInTime: "08:00 AM", createdAt: "2026-01-10"
        },
        {
          id: "u2", clerkId: "clk_2", name: "Tariq Mahmood", email: "tariq@droply.com", phone: "+92 321 4455667",
          role: "MANAGER", isActive: true, todayAttendance: "PRESENT", checkInTime: "08:15 AM", createdAt: "2026-02-15"
        },
        {
          id: "u3", clerkId: "clk_3", name: "Majid Ali", email: "majid@droply.com", phone: "+92 333 9988776",
          role: "RIDER", isActive: true, zones: [{ id: "z1", name: "Farid Town" }],
          todayAttendance: "NOT_MARKED", checkInTime: null, createdAt: "2026-03-01"
        },
        {
          id: "u4", clerkId: "clk_4", name: "Usman Tariq", email: "usman@droply.com", phone: "+92 301 5566778",
          role: "RIDER", isActive: true, zones: [{ id: "z2", name: "Tariq Bin Ziad" }],
          todayAttendance: "HALF_DAY", checkInTime: "12:30 PM", createdAt: "2026-05-20"
        },
        {
          id: "u5", clerkId: "clk_5", name: "Bilal Hussain", email: "bilal@droply.com", phone: "+92 304 1122445",
          role: "RIDER", isActive: false, zones: [], // Soft-deleted rider
          todayAttendance: "NOT_MARKED", checkInTime: null, createdAt: "2026-01-20"
        }
      ];
    },
    enabled: Boolean(branchId),
  });
}

export function useStaffMember(branchId: string, staffId: string) {
  return useQuery({
    queryKey: ["staff", branchId, staffId],
    queryFn: async (): Promise<BranchUserItem | null> => {
      // Dummy data representing the detailed fetch
      if (staffId === "u3") {
        return {
          id: "u3", clerkId: "clk_3", name: "Majid Ali", email: "majid@droply.com", phone: "+92 333 9988776",
          role: "RIDER", isActive: true, zones: [{ id: "z1", name: "Farid Town (Block Y & Z)" }],
          todayAttendance: "NOT_MARKED", checkInTime: null, createdAt: "2026-03-01",
          attendanceHistory: [
            { date: "2026-09-03", status: "PRESENT", checkInTime: "08:00 AM" },
            { date: "2026-09-02", status: "PRESENT", checkInTime: "08:15 AM" },
            { date: "2026-09-01", status: "HALF_DAY", checkInTime: "12:30 PM" },
            { date: "2026-08-31", status: "ABSENT", checkInTime: null },
          ]
        };
      }
      return null;
    },
    enabled: Boolean(branchId && staffId),
  });
}
export function useUpdateStaff(branchId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<BranchUserItem> }) => {
      const { data } = await apiClient.patch(`/branches/${branchId}/staff/${id}`, payload);
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff", branchId] }),
  });
}