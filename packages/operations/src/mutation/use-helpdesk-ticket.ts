import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createHelpdeskTicket,
  updateHelpdeskTicket,
  deleteHelpdeskTicket,
  addHelpdeskTicketTimelineEntry,
  resolveHelpdeskTicket,
  helpdeskTicketQueries,
} from "@repo/api-client";
import {
  CreateHelpdeskTicketBody,
  UpdateHelpdeskTicketBody,
  AddHelpdeskTimelineEntryBody,
  HelpdeskTicketData,
} from "@repo/schema";

export const useCreateHelpdeskTicket = () => {
  const queryClient = useQueryClient();
  return useMutation<HelpdeskTicketData, Error, CreateHelpdeskTicketBody>({
    mutationKey: helpdeskTicketQueries.create.key,
    mutationFn: (data: CreateHelpdeskTicketBody) => createHelpdeskTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: helpdeskTicketQueries.list.key,
      });
    },
  });
};

export const useUpdateHelpdeskTicket = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<HelpdeskTicketData, Error, UpdateHelpdeskTicketBody>({
    mutationKey: helpdeskTicketQueries.update(id).key,
    mutationFn: (data: UpdateHelpdeskTicketBody) =>
      updateHelpdeskTicket(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: helpdeskTicketQueries.list.key,
      });
      queryClient.invalidateQueries({
        queryKey: helpdeskTicketQueries.detail(id).key,
      });
    },
  });
};

export const useDeleteHelpdeskTicket = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, void>({
    mutationKey: helpdeskTicketQueries.delete(id).key,
    mutationFn: () => deleteHelpdeskTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: helpdeskTicketQueries.list.key,
      });
    },
  });
};

export const useAddHelpdeskTicketTimelineEntry = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<HelpdeskTicketData, Error, AddHelpdeskTimelineEntryBody>({
    mutationKey: helpdeskTicketQueries.addTimeline(id).key,
    mutationFn: (data: AddHelpdeskTimelineEntryBody) =>
      addHelpdeskTicketTimelineEntry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: helpdeskTicketQueries.detail(id).key,
      });
    },
  });
};

export const useResolveHelpdeskTicket = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<HelpdeskTicketData, Error, void>({
    mutationKey: helpdeskTicketQueries.resolve(id).key,
    mutationFn: () => resolveHelpdeskTicket(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: helpdeskTicketQueries.detail(id).key,
      });
      queryClient.invalidateQueries({
        queryKey: helpdeskTicketQueries.list.key,
      });
    },
  });
};
