import { ResidentFormValues } from "./resident-form";

export interface Resident extends ResidentFormValues {
  id: string;
}

export let mockResidents: Resident[] = [
  {
    id: "res-1",
    firstName: "Amit",
    lastName: "Sharma",
    mobileNumber: "9876543210",
    email: "amit.sharma@example.com",
    residentType: "OWNER",
    towerId: "tower-a",
    flatNumber: "101",
    moveInDate: "2024-01-15",
    ownershipStatus: "OWNER",
    isPrimary: true,
    vehicleType: "FOUR_WHEELER",
    vehicleNumber: "MH12AB1234",
    vehicleBrand: "Honda",
    vehicleModel: "City",
    vehicleColor: "Silver",
    parkingSlot: "P-101",
    docType: "AADHAR",
    documentNumber: "1234-5678-9012",
  },
  {
    id: "res-2",
    firstName: "Priya",
    lastName: "Patel",
    mobileNumber: "8765432109",
    email: "priya.patel@example.com",
    residentType: "TENANT",
    towerId: "tower-b",
    flatNumber: "305",
    moveInDate: "2024-06-01",
    ownershipStatus: "TENANT",
    isPrimary: true,
    vehicleType: "TWO_WHEELER",
    vehicleNumber: "GJ01XY5678",
    vehicleBrand: "Activa",
    vehicleModel: "6G",
    vehicleColor: "Black",
    parkingSlot: "P-305",
    docType: "PAN",
    documentNumber: "ABCDE1234F",
  },
  {
    id: "res-3",
    firstName: "Rahul",
    lastName: "Sharma",
    mobileNumber: "7654321098",
    email: "rahul.sharma@example.com",
    residentType: "FAMILY_MEMBER",
    relationship: "SON",
    towerId: "tower-a",
    flatNumber: "101",
    moveInDate: "2024-01-15",
    ownershipStatus: "TENANT",
    isPrimary: false,
    vehicleType: "NONE",
    docType: "NONE",
  },
];

export const addResident = (resident: Omit<Resident, "id">) => {
  const newResident = {
    ...resident,
    id: `res-${Date.now()}`,
  };
  mockResidents = [newResident, ...mockResidents];
  return newResident;
};

export const updateResident = (id: string, updatedFields: Partial<Resident>) => {
  mockResidents = mockResidents.map((r) =>
    r.id === id ? { ...r, ...updatedFields } : r
  );
  return mockResidents.find((r) => r.id === id);
};

export const deleteResident = (id: string) => {
  mockResidents = mockResidents.filter((r) => r.id !== id);
};
