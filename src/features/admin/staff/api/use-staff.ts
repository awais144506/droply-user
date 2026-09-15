import { useQuery } from "@tanstack/react-query";
import { staffKeys } from "./staff-keys";
import { staffApi } from "./staff.service";

// 2. Fetch All Staff for a Branch
export function useStaffList(branchId: string, searchFilter?: string, roleFilter?: string, statusFilter?: string) {
  return useQuery({
    queryKey: staffKeys.branchList(branchId || ""),
    queryFn: () => staffApi.getAllStaff(branchId),
    select: (staff) => {
      const activeStaffCount = staff.filter((s) => s.status === 'ACTIVE').length;
      const disableStaff = staff.filter((s) => s.status === 'DISABLE').length;
      const activeManagers = staff.filter((s) => s.designation === 'MANAGER').length;
      const activeRiders = staff.filter((s) => s.designation === 'RIDER').length;
      const filterStaff = staff.filter((st) => {
        const matchesSearch = searchFilter
          ? (st.name.toLowerCase() || "").includes(searchFilter.toLowerCase())
          : true;
        const matchesRole = roleFilter
          ? st.designation === roleFilter
          : true;

        const matchesStatus = statusFilter
          ? st.status === statusFilter
          : true;
        return matchesSearch && matchesRole && matchesStatus
      })

      const riderOptions = staff
        .filter((member: { designation: string }) => member.designation === "RIDER")
        .map((rider: { name: string; phone: string; id: string }) => ({
          label: `${rider.name} (${rider.phone})`,
          value: rider.id,
        }));

      return {
        staff: filterStaff,
        stats: {
          activeStaffCount,
          disableStaff,
          activeManagers,
          activeRiders
        },
        riderOptions,
      };
    },
    enabled: !!branchId,
  });
}

// 3. Fetch Single Staff (for Edit/Details Page)
export function useStaffDetail(id: string) {
  return useQuery({
    queryKey: staffKeys.detail(id || ""),
    queryFn: () => staffApi.getStaff(id),
    enabled: !!id,
  });
}

// 4. Fetch Staff Activity Logs
export function useStaffLogs(branchId: string) {
  return useQuery({
    queryKey: staffKeys.logs(branchId || ""),
    queryFn: () => staffApi.getStaffLogs(branchId),
    enabled: !!branchId,
  });
}

