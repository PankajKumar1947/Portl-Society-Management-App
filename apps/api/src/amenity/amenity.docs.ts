import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiBearerAuth } from "@nestjs/swagger";

import { AMENITY_CATEGORIES, AMENITY_TYPES, AMENITY_STATUSES } from "@repo/schema";

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
    ApiQuery({ name: "search", required: false, description: "Search by name or location" }),
    ApiQuery({ name: "category", required: false, description: "Filter by category", enum: AMENITY_CATEGORIES }),
    ApiQuery({ name: "type", required: false, description: "Filter by type (INDOOR/OUTDOOR)", enum: AMENITY_TYPES }),
    ApiQuery({ name: "status", required: false, description: "Filter by status", enum: AMENITY_STATUSES }),
    ApiQuery({ name: "towerIds", required: false, description: "Comma-separated tower IDs" }),
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
