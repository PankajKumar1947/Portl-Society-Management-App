import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from "@nestjs/swagger";

export function ApiAmenityController() {
  return applyDecorators(ApiTags("Amenities"), ApiBearerAuth(), ApiResponse({ status: 401, description: "Unauthorized" }));
}

export function ApiCreateAmenity() {
  return applyDecorators(
    ApiOperation({ summary: "Create a new society amenity" }),
    ApiResponse({ status: 201, description: "Amenity successfully created" }),
    ApiResponse({ status: 400, description: "Invalid request payload" }),
  );
}

export function ApiGetAmenities() {
  return applyDecorators(
    ApiOperation({ summary: "Retrieve all amenities of the current society" }),
    ApiResponse({ status: 200, description: "List of amenities returned successfully" }),
  );
}

export function ApiGetAmenityDetail() {
  return applyDecorators(
    ApiOperation({ summary: "Retrieve detailed description of a specific amenity" }),
    ApiResponse({ status: 200, description: "Amenity details returned successfully" }),
    ApiResponse({ status: 404, description: "Amenity not found" }),
  );
}

export function ApiUpdateAmenity() {
  return applyDecorators(
    ApiOperation({ summary: "Update an existing amenity details" }),
    ApiResponse({ status: 200, description: "Amenity details updated successfully" }),
    ApiResponse({ status: 404, description: "Amenity not found" }),
  );
}

export function ApiDeleteAmenity() {
  return applyDecorators(
    ApiOperation({ summary: "Remove an amenity from the society registry" }),
    ApiResponse({ status: 200, description: "Amenity deleted successfully" }),
    ApiResponse({ status: 404, description: "Amenity not found" }),
  );
}
