import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComplaint, updateComplaint, deleteComplaint, addComplaintTimelineEntry, complaintQueries } from "@repo/api-client";
import { CreateComplaintBody, UpdateComplaintBody, AddTimelineEntryBody, ComplaintData } from "@repo/schema";

export const useCreateComplaint = () => {
  const queryClient = useQueryClient();
  return useMutation<ComplaintData, Error, CreateComplaintBody>({
    mutationKey: complaintQueries.create.key,
    mutationFn: (data: CreateComplaintBody) => createComplaint(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complaintQueries.list.key });
    },
  });
};

export const useUpdateComplaint = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<ComplaintData, Error, UpdateComplaintBody>({
    mutationKey: complaintQueries.update(id).key,
    mutationFn: (data: UpdateComplaintBody) => updateComplaint(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complaintQueries.list.key });
      queryClient.invalidateQueries({ queryKey: complaintQueries.detail(id).key });
    },
  });
};

export const useDeleteComplaint = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, void>({
    mutationKey: complaintQueries.delete(id).key,
    mutationFn: () => deleteComplaint(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complaintQueries.list.key });
      queryClient.invalidateQueries({ queryKey: complaintQueries.detail(id).key });
    },
  });
};

export const useAddComplaintTimelineEntry = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<ComplaintData, Error, AddTimelineEntryBody>({
    mutationKey: complaintQueries.addTimeline(id).key,
    mutationFn: (data: AddTimelineEntryBody) => addComplaintTimelineEntry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complaintQueries.detail(id).key });
    },
  });
};
