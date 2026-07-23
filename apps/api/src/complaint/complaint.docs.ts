import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiBearerAuth } from "@nestjs/swagger";

import { COMPLAINT_CATEGORIES, COMPLAINT_STATUSES } from "@repo/schema";

export function ApiComplaintController() {
  return applyDecorators(ApiTags("Complaints"), ApiBearerAuth(), ApiResponse({ status: 401, description: "Unauthorized" }));
}

export function ApiCreateComplaint() {
  return applyDecorators(
    ApiOperation({ summary: "Submit a new complaint" }),
    ApiResponse({ status: 201, description: "Complaint submitted successfully" }),
    ApiResponse({ status: 400, description: "Invalid request payload" }),
  );
}

export function ApiGetComplaints() {
  return applyDecorators(
    ApiOperation({ summary: "Retrieve all complaints for the current society" }),
    ApiQuery({ name: "search", required: false, description: "Search by subject or description" }),
    ApiQuery({ name: "status", required: false, description: "Filter by status", enum: COMPLAINT_STATUSES }),
    ApiQuery({ name: "category", required: false, description: "Filter by category", enum: COMPLAINT_CATEGORIES }),
    ApiResponse({ status: 200, description: "List of complaints returned successfully" }),
  );
}

export function ApiGetComplaint() {
  return applyDecorators(
    ApiOperation({ summary: "Get complaint details" }),
    ApiResponse({ status: 200, description: "Complaint details returned successfully" }),
    ApiResponse({ status: 404, description: "Complaint not found" }),
  );
}

export function ApiUpdateComplaint() {
  return applyDecorators(
    ApiOperation({ summary: "Update complaint details" }),
    ApiResponse({ status: 200, description: "Complaint updated successfully" }),
    ApiResponse({ status: 404, description: "Complaint not found" }),
  );
}

export function ApiDeleteComplaint() {
  return applyDecorators(
    ApiOperation({ summary: "Delete a complaint" }),
    ApiResponse({ status: 200, description: "Complaint deleted successfully" }),
    ApiResponse({ status: 404, description: "Complaint not found" }),
  );
}

export function ApiAddTimelineEntry() {
  return applyDecorators(
    ApiOperation({ summary: "Add a timeline entry to a complaint" }),
    ApiResponse({ status: 201, description: "Timeline entry added successfully" }),
    ApiResponse({ status: 404, description: "Complaint not found" }),
  );
}
