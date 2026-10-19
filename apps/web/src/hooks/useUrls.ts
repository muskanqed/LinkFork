"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  urlsApi,
  UrlItem,
  UrlWithClicks,
  CreateUrlPayload,
  UpdateUrlPayload,
  DeleteUrlResponseData,
} from "@/lib/urls-api";

export const urlKeys = {
  all: ["urls"] as const,
  lists: () => [...urlKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...urlKeys.lists(), filters] as const,
  details: () => [...urlKeys.all, "detail"] as const,
  detail: (id: string) => [...urlKeys.details(), id] as const,
  clicks: () => [...urlKeys.all, "clicks"] as const,
  clicksByUrl: (id: string) => [...urlKeys.clicks(), id] as const,
};

export function useUrls() {
  return useQuery<UrlItem[], Error>({
    queryKey: urlKeys.lists(),
    queryFn: async () => {
      return urlsApi.getUrls();
    },
    staleTime: 30 * 1000,
  });
}

export function useUrl(id: string) {
  return useQuery<UrlItem, Error>({
    queryKey: urlKeys.detail(id),
    queryFn: async () => {
      return urlsApi.getUrlById(id);
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

export function useUrlClicks(urlId: string = "all") {
  return useQuery<UrlWithClicks[], Error>({
    queryKey: urlKeys.clicksByUrl(urlId),
    queryFn: async () => {
      return urlsApi.getClicksByUrlId(urlId);
    },
    staleTime: 30 * 1000,
  });
}

export function useCreateUrl() {
  const queryClient = useQueryClient();

  return useMutation<UrlItem, Error, CreateUrlPayload>({
    mutationFn: (payload: CreateUrlPayload) => urlsApi.createUrl(payload),
    onSuccess: (newUrl) => {
      queryClient.setQueryData<UrlItem[]>(urlKeys.lists(), (old) => {
        if (!old) return [newUrl];
        return [newUrl, ...old];
      });
      queryClient.invalidateQueries({ queryKey: urlKeys.all });
    },
  });
}

export function useUpdateUrl() {
  const queryClient = useQueryClient();

  return useMutation<
    UrlItem,
    Error,
    { id: string; payload: UpdateUrlPayload }
  >({
    mutationFn: ({ id, payload }) => urlsApi.updateUrl(id, payload),
    onSuccess: (updatedUrl, { id }) => {
      queryClient.setQueryData(urlKeys.detail(id), updatedUrl);
      queryClient.setQueryData<UrlItem[]>(urlKeys.lists(), (old) => {
        if (!old) return [updatedUrl];
        return old.map((item) => (item.id === id ? updatedUrl : item));
      });
      queryClient.invalidateQueries({ queryKey: urlKeys.all });
    },
  });
}

export function useDeleteUrl() {
  const queryClient = useQueryClient();

  return useMutation<DeleteUrlResponseData, Error, string>({
    mutationFn: (id: string) => urlsApi.deleteUrl(id),
    onSuccess: (_data, deletedId) => {
      queryClient.setQueryData<UrlItem[]>(urlKeys.lists(), (old) => {
        if (!old) return [];
        return old.filter((item) => item.id !== deletedId);
      });
      queryClient.removeQueries({ queryKey: urlKeys.detail(deletedId) });
      queryClient.invalidateQueries({ queryKey: urlKeys.all });
    },
  });
}
