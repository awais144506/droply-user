/* eslint-disable @typescript-eslint/no-explicit-any */
import { UpdateStaffFormData } from "../schema/update-staff-schema";

export const getEditStaffFormValues = (
    user: any,
    zoneOptions: any[],
    vehicleOptions: any[]
): UpdateStaffFormData => {
    // 1. If data is still loading, return a safe empty shell
    if (!user) {
        return {
            name: "", phone: "", designation: "", cnic: "", salary: 0,
            address: "", bloodGroup: "", fatherName: "", fatherCnic: "",
            guarantorName: "", guarantorCnic: "", guarantorPhone: "",
            licenseNumber: "", joiningDate: "", zoneIds: [], vehicleIds: [],
        };
    }

    // 2. Safely map the arrays
    const mappedZoneIds = user.zones?.map((userZone: any) => {
        const matchedOption = zoneOptions.find((opt: any) => opt.label === userZone.name);
        return matchedOption ? matchedOption.value : null;
    }).filter(Boolean) || [];

    const mappedVehicleIds = user.assignedVehicles?.map((userVehicle: any) => {
        const matchedOption = vehicleOptions.find((opt: any) => opt.label === userVehicle.registration);
        return matchedOption ? matchedOption.value : null;
    }).filter(Boolean) || [];

    // 3. Return the perfectly shaped object
    return {
        name: user.name || "",
        phone: user.phone || "",
        designation: user.designation || "",
        cnic: user.cnic || "",
        salary: user.basicSalary || 0,
        address: user.currentAddress || "",
        bloodGroup: user.bloodGroup || "",
        fatherName: user.fatherName || "",
        fatherCnic: user.fatherCnic || "",
        guarantorName: user.guarantorName || "",
        guarantorCnic: user.guarantorCnic || "",
        guarantorPhone: user.guarantorPhone || "",
        licenseNumber: user.licenseNumber || "",
        joiningDate: user.joiningDate ? new Date(user.joiningDate).toISOString().split('T')[0] : "",
        zoneIds: mappedZoneIds,
        vehicleIds: mappedVehicleIds,
    };
};