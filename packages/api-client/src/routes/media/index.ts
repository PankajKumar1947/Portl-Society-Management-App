import {
  MediaResponse,
  MediaListResponse,
  EntityType,
  MediaPurpose,
} from "@repo/schema";
import { mediaQueries } from "../../react-queries/media";
import { apiClient } from "../../services/axios-instance";

export interface UploadMediaParams {
  file: File | Blob | { uri: string; name: string; type: string };
  purpose: MediaPurpose;
  entityType: EntityType;
  entityId?: string;
  metadata?: string;
}

export const uploadMedia = async (params: UploadMediaParams): Promise<MediaResponse> => {
  const formData = new FormData();
  formData.append("file", params.file as unknown as Blob);
  formData.append("purpose", params.purpose);
  formData.append("entityType", params.entityType);
  if (params.entityId) {
    formData.append("entityId", params.entityId);
  }
  if (params.metadata) {
    formData.append("metadata", params.metadata);
  }

  const res = await apiClient.post(mediaQueries.uploadMedia.endpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getMediaDetail = async (mediaId: string): Promise<MediaResponse> => {
  const res = await apiClient.get(mediaQueries.getMediaDetail(mediaId).endpoint);
  return res.data;
};

export const getMediaList = async (params: {
  entityType: EntityType;
  entityId: string;
}): Promise<MediaListResponse> => {
  const res = await apiClient.get(mediaQueries.getMediaList.endpoint, { params });
  return res.data;
};

export const deleteMedia = async (mediaId: string): Promise<{ success: boolean; message: string }> => {
  const res = await apiClient.delete(mediaQueries.delete(mediaId).endpoint);
  return res.data;
};
