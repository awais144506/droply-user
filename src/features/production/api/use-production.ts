import { useQuery } from "@tanstack/react-query";

export interface ProductionBatch {
  id: string;
  batchCode: string;
  date: string;
  itemName: string;
  quantityProduced: number;
  rawMaterialsConsumed: string;
  supervisor: string;
  status: "COMPLETED" | "VERIFIED" | "IN_PROGRESS";
}

export function useProduction(branchId: string) {
  return useQuery({
    queryKey: ["production-batches", branchId],
    queryFn: async (): Promise<ProductionBatch[]> => {
      return [
        {
          id: "1", batchCode: "BAT-2026-0901", date: "2026-09-03",
          itemName: "19L Mineral Water Bottle", quantityProduced: 500,
          rawMaterialsConsumed: "500 Caps, 500 Seals, 500 Raw 19L Shells",
          supervisor: "Tariq Mahmood", status: "VERIFIED"
        },
        {
          id: "2", batchCode: "BAT-2026-0902", date: "2026-09-02",
          itemName: "19L Mineral Water Bottle", quantityProduced: 450,
          rawMaterialsConsumed: "450 Caps, 450 Seals, 450 Raw 19L Shells",
          supervisor: "Chaudhry Bilal", status: "VERIFIED"
        },
        {
          id: "3", batchCode: "BAT-2026-0903", date: "2026-09-01",
          itemName: "1.5L PET Cartons (12 Pcs)", quantityProduced: 120,
          rawMaterialsConsumed: "1,440 Pet Bottles, 120 Master Cartons",
          supervisor: "Tariq Mahmood", status: "COMPLETED"
        }
      ];
    },
    enabled: Boolean(branchId),
  });
}