import * as yup from "yup";

export const createCustomerSchema = yup.object().shape({
  partyType: yup.string().oneOf(["CUSTOMER", "VENDOR", "BOTH"]).required("Party type is required"),
  customerCategory: yup.string().oneOf(["DOMESTIC", "COMMERCIAL", "CORPORATE"]).required("Customer category is required"),
  
  name: yup.string().min(3, "Name is too short").required("Name is required"),
  phone: yup.string().required("Phone number is required"),
  zoneId: yup.string().optional(),
  
  address: yup.string().required("Address is required"),
  latitude: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  longitude: yup.number().nullable().transform((v, o) => (o === "" ? null : v)),
  
  customerCredit: yup.number().min(0).transform((v, o) => (o === "" ? 0 : v)).default(0),
  customerAdvance: yup.number().min(0).transform((v, o) => (o === "" ? 0 : v)).default(0),
  securityHeld: yup.number().min(0).transform((v, o) => (o === "" ? 0 : v)).default(0),
  
  openingReturnables: yup.array().of(
    yup.object().shape({
      productId: yup.string().required("Select an item"),
      quantity: yup.number().min(1, "Minimum 1 unit required").required("Quantity is required"),
    })
  ).default([]),
});

export type CreateCustomerFormData = yup.InferType<typeof createCustomerSchema>;