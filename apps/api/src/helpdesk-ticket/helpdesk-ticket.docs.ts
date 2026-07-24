import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";

import { TICKET_STATUSES, TICKET_CATEGORIES } from "@repo/schema";

export function ApiCreateHelpdeskTicket() {
  return applyDecorators(
    ApiOperation({ summary: "Submit a new support ticket" }),
    ApiResponse({ status: 201, description: "Ticket submitted successfully" }),
    ApiResponse({ status: 400, description: "Invalid request payload" }),
  );
}

export function ApiGetHelpdeskTickets() {
  return applyDecorators(
    ApiOperation({ summary: "Retrieve all support tickets for the current society" }),
    ApiQuery({ name: "search", required: false, description: "Search by subject or description" }),
    ApiQuery({ name: "status", required: false, description: "Filter by status", enum: TICKET_STATUSES }),
    ApiQuery({ name: "category", required: false, description: "Filter by category", enum: TICKET_CATEGORIES }),
    ApiResponse({ status: 200, description: "Tickets retrieved successfully" }),
  );
}

export function ApiGetHelpdeskTicket() {
  return applyDecorators(
    ApiOperation({ summary: "Get ticket details" }),
    ApiResponse({ status: 200, description: "Ticket details retrieved successfully" }),
    ApiResponse({ status: 404, description: "Ticket not found" }),
  );
}

export function ApiUpdateHelpdeskTicket() {
  return applyDecorators(
    ApiOperation({ summary: "Update ticket details" }),
    ApiResponse({ status: 200, description: "Ticket updated successfully" }),
    ApiResponse({ status: 404, description: "Ticket not found" }),
  );
}

export function ApiDeleteHelpdeskTicket() {
  return applyDecorators(
    ApiOperation({ summary: "Delete a ticket" }),
    ApiResponse({ status: 200, description: "Ticket deleted successfully" }),
    ApiResponse({ status: 404, description: "Ticket not found" }),
  );
}

export function ApiAddHelpdeskTimelineEntry() {
  return applyDecorators(
    ApiOperation({ summary: "Add a timeline entry to a ticket" }),
    ApiResponse({ status: 201, description: "Timeline entry added successfully" }),
    ApiResponse({ status: 404, description: "Ticket not found" }),
  );
}

export function ApiResolveHelpdeskTicket() {
  return applyDecorators(
    ApiOperation({ summary: "Resolve a support ticket" }),
    ApiResponse({ status: 200, description: "Ticket resolved successfully" }),
    ApiResponse({ status: 400, description: "Ticket already resolved or rejected" }),
    ApiResponse({ status: 404, description: "Ticket not found" }),
  );
}
