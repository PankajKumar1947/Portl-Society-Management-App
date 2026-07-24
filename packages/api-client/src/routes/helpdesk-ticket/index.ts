import { apiClient } from "../../services/axios-instance";
import {
  CreateHelpdeskTicketBody,
  UpdateHelpdeskTicketBody,
  AddHelpdeskTimelineEntryBody,
  HelpdeskTicketListResponse,
  HelpdeskTicketData,
  HelpdeskTicketFilterOptions,
} from "@repo/schema";
import { helpdeskTicketQueries } from "../../react-queries/helpdesk-ticket";

export const createHelpdeskTicket = async (
  data: CreateHelpdeskTicketBody,
): Promise<HelpdeskTicketData> => {
  const res = await apiClient.post(helpdeskTicketQueries.create.endpoint, data);
  return res.data.data;
};

export const getHelpdeskTickets = async (
  params?: HelpdeskTicketFilterOptions,
): Promise<HelpdeskTicketListResponse["data"]> => {
  const res = await apiClient.get(helpdeskTicketQueries.list.endpoint, { params });
  return res.data.data;
};

export const getHelpdeskTicketDetail = async (
  id: string,
): Promise<HelpdeskTicketData> => {
  const res = await apiClient.get(helpdeskTicketQueries.detail(id).endpoint);
  return res.data.data;
};

export const updateHelpdeskTicket = async (
  id: string,
  data: UpdateHelpdeskTicketBody,
): Promise<HelpdeskTicketData> => {
  const res = await apiClient.patch(helpdeskTicketQueries.update(id).endpoint, data);
  return res.data.data;
};

export const deleteHelpdeskTicket = async (id: string): Promise<boolean> => {
  const res = await apiClient.delete(helpdeskTicketQueries.delete(id).endpoint);
  return res.data.success;
};

export const addHelpdeskTicketTimelineEntry = async (
  id: string,
  data: AddHelpdeskTimelineEntryBody,
): Promise<HelpdeskTicketData> => {
  const res = await apiClient.post(
    helpdeskTicketQueries.addTimeline(id).endpoint,
    data,
  );
  return res.data.data;
};

export const resolveHelpdeskTicket = async (id: string): Promise<HelpdeskTicketData> => {
  const res = await apiClient.post(helpdeskTicketQueries.resolve(id).endpoint);
  return res.data.data;
};
