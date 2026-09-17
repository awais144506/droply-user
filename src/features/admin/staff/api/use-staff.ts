import { useQuery } from "@tanstack/react-query";
import { staffKeys } from "./staff-keys";
import { staffApi } from "./staff.service";
import { useRole } from "@/lib/hooks/use-role";

// 2. Fetch All Staff for a Branch
export function useStaffList(branchId: string, searchFilter?: string, roleFilter?: string, statusFilter?: string) {
  const { maxUsersLimit } = useRole();
  return useQuery({
    queryKey: staffKeys.branchList(branchId || ""),
    queryFn: () => staffApi.getAllStaff(branchId),

    select: (payload) => {

      const isLimitReached = payload.stats.activeStaffCount >= maxUsersLimit;

      const filterStaff = payload.staff.filter((st) => {
        const matchesSearch = searchFilter
          ? (st.name.toLowerCase() || "").includes(searchFilter.toLowerCase())
          : true;
        const matchesRole = roleFilter
          ? st.designation === roleFilter
          : true;

        const matchesStatus = statusFilter
          ? st.status === statusFilter
          : true;
        return matchesSearch && matchesRole && matchesStatus;
      });
      const riderOptions = payload.staff
        .filter((member: { designation: string }) => member.designation === "RIDER")
        .map((rider: { name: string; phone: string; id: string }) => ({
          label: `${rider.name} (${rider.phone})`,
          value: rider.id,
        }));

      // 4. Return everything cleanly
      return {
        staff: filterStaff,
        stats: payload.stats,
        riderOptions,
        isLimitReached
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

