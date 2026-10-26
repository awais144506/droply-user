import { Staff } from "../types/staff";
import { CreateStaffFormData } from "../schema/create-staff-schema";
import { toDateInputString } from "@/lib/hooks/use-app-form";

export const defaultCreateStaffValues: CreateStaffFormData = {
    role: "RIDER",
    name: "",
    email: "",
    phone: "",
    cnic: "",
    address: "",
    joiningDate: toDateInputString(),
    salary: 0,
    zoneIds: [],
    vehicleId: "",
    licenseNumber: "",
    fatherName: "",
    fatherCnic: "",
    bloodGroup: "",
    guarantorName: "",
    guarantorCnic: "",
    guarantorPhone: "",
};

export const getEditStaffFormValues = (user?: Staff): CreateStaffFormData => {
    if (!user) return defaultCreateStaffValues;

    return {
        role: user.role === "MANAGER" ? "MANAGER" : "RIDER",
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        cnic: user.cnic || "",
        address: user.address || "",
        joiningDate: toDateInputString(user.joiningDate),
        salary: Number(user.basicSalary ?? 0),
        zoneIds: user.zones?.map((z) => z.id) || [],
        vehicleId: user.assignedVehicles?.[0]?.id || "",
        licenseNumber: user.hrProfile?.licenseNumber || "",
        fatherName: user.hrProfile?.fatherName || "",
        fatherCnic: user.hrProfile?.fatherCnic || "",
        bloodGroup: user.hrProfile?.bloodGroup || "",
        guarantorName: user.hrProfile?.guarantorName || "",
        guarantorCnic: user.hrProfile?.guarantorCnic || "",
        guarantorPhone: user.hrProfile?.guarantorPhone || "",
    };
};