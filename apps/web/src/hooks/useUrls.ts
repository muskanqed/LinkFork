"use client";

import { useMemo } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  urlsApi,
  createClicksMap,
  formatShortUrl,
  UrlItem,
  UrlWithClicks,
  CreateUrlPayload,
  UpdateUrlPayload,
  DeleteUrlResponseData,
  PaginatedUrlsData,
} from "@/lib/urls-api";

export const urlKeys = {
  all: ["urls"] as const,
  lists: () => [...urlKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    filters ? ([...urlKeys.lists(), filters] as const) : urlKeys.lists(),
  paginated: (page: number, limit: number) =>
    [...urlKeys.lists(), "paginated", { page, limit }] as const,
  details: () => [...urlKeys.all, "detail"] as const,
  detail: (id: string) => [...urlKeys.details(), id] as const,
  clicks: () => [...urlKeys.all, "clicks"] as const,
  clicksByUrl: (id: string) =>
    id === "all" ? urlKeys.clicks() : ([...urlKeys.clicks(), id] as const),
};

export interface EnrichedUrlItem extends UrlItem {
  clicks: number;
  shortUrl: string;
}

export function useUrls() {
  return useQuery<UrlItem[], Error>({
    queryKey: urlKeys.lists(),
    queryFn: async () => {
      return urlsApi.getUrls();
    },
    staleTime: 30 * 1000,
  });
}

export function useUrlsPaginated(page: number = 1, limit: number = 10) {
  return useQuery<PaginatedUrlsData, Error>({
    queryKey: urlKeys.paginated(page, limit),
    queryFn: async () => {
      return urlsApi.getUrlsPaginated({ page, limit });
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

export function useUrl(id: string) {
  const queryClient = useQueryClient();

  return useQuery<UrlItem, Error>({
    queryKey: urlKeys.detail(id),
    queryFn: async () => {
      return urlsApi.getUrlById(id);
    },
    initialData: () => {
      if (!id) return undefined;
      const list = queryClient.getQueryData<UrlItem[]>(urlKeys.lists());
      const fromList = list?.find((item) => item.id === id);
      if (fromList) return fromList;
      const paginatedQueries = queryClient.getQueriesData<PaginatedUrlsData>({
        queryKey: [...urlKeys.lists(), "paginated"],
      });
      for (const [, data] of paginatedQueries) {
        const found = data?.urls?.find((item) => item.id === id);
        if (found) return found;
      }
      return undefined;
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

export function useUrlClicks(urlId: string = "all") {
  const queryClient = useQueryClient();

  return useQuery<UrlWithClicks[], Error>({
    queryKey: urlKeys.clicksByUrl(urlId),
    queryFn: async () => {
      return urlsApi.getClicksByUrlId(urlId);
    },
    initialData: () => {
      if (urlId !== "all") {
        return queryClient.getQueryData<UrlWithClicks[]>(urlKeys.clicks());
      }
      return undefined;
    },
    enabled: Boolean(urlId),
    staleTime: 30 * 1000,
  });
}

/**
 * Composite hook that fetches URLs and their click metrics, returning enriched URLs
 * with clicks count and short URL pre-formatted. Used across Dashboard, Links, and Analytics.
 */
export function useUrlsWithClicks() {
  const urlsQuery = useUrls();
  const clicksQuery = useUrlClicks("all");

  const clicksMap = useMemo(() => {
    return createClicksMap(clicksQuery.data);
  }, [clicksQuery.data]);

  const urls = useMemo<EnrichedUrlItem[]>(() => {
    if (!urlsQuery.data) return [];
    return urlsQuery.data.map((u) => ({
      ...u,
      clicks: clicksMap.get(u.id) ?? 0,
      shortUrl: formatShortUrl(u.shortCode),
    }));
  }, [urlsQuery.data, clicksMap]);

  const totalClicks = useMemo(() => {
    return urls.reduce((sum, u) => sum + u.clicks, 0);
  }, [urls]);

  return {
    urls,
    rawUrls: urlsQuery.data,
    clicksMap,
    totalClicks,
    totalLinks: urls.length,
    isLoading: urlsQuery.isLoading || clicksQuery.isLoading,
    isError: urlsQuery.isError || clicksQuery.isError,
    error: urlsQuery.error || clicksQuery.error,
    refetch: async () => {
      await Promise.all([urlsQuery.refetch(), clicksQuery.refetch()]);
    },
  };
}

/**
 * Composite hook that fetches a paginated page of URLs along with click metrics,
 * returning enriched URLs with click counts and formatted short URLs.
 */
export function usePaginatedUrlsWithClicks(page: number = 1, limit: number = 10) {
  const paginatedQuery = useUrlsPaginated(page, limit);
  const clicksQuery = useUrlClicks("all");

  const clicksMap = useMemo(() => {
    return createClicksMap(clicksQuery.data);
  }, [clicksQuery.data]);

  const urls = useMemo<EnrichedUrlItem[]>(() => {
    if (!paginatedQuery.data?.urls) return [];
    return paginatedQuery.data.urls.map((u) => ({
      ...u,
      clicks: clicksMap.get(u.id) ?? 0,
      shortUrl: formatShortUrl(u.shortCode),
    }));
  }, [paginatedQuery.data?.urls, clicksMap]);

  return {
    urls,
    rawUrls: paginatedQuery.data?.urls,
    pagination: paginatedQuery.data?.pagination,
    totalLinks: paginatedQuery.data?.pagination?.totalItems ?? 0,
    totalPages: paginatedQuery.data?.pagination?.totalPages ?? 0,
    page: paginatedQuery.data?.pagination?.page ?? page,
    limit: paginatedQuery.data?.pagination?.limit ?? limit,
    isLoading: paginatedQuery.isLoading || clicksQuery.isLoading,
    isFetching: paginatedQuery.isFetching,
    isPlaceholderData: paginatedQuery.isPlaceholderData,
    isError: paginatedQuery.isError || clicksQuery.isError,
    error: paginatedQuery.error || clicksQuery.error,
    refetch: async () => {
      await Promise.all([paginatedQuery.refetch(), clicksQuery.refetch()]);
    },
  };
}

/**
 * Composite hook that fetches a single URL item along with its specific click count
 * and formatted short URL for the URL detail page.
 */
export function useUrlDetail(id: string) {
  const urlQuery = useUrl(id);
  const clicksQuery = useUrlClicks(id);

  const totalClicks = useMemo(() => {
    if (!clicksQuery.data || !Array.isArray(clicksQuery.data)) return 0;
    const match = clicksQuery.data.find((item) => item.id === id);
    return match?._count?.clicks ?? 0;
  }, [clicksQuery.data, id]);

  const shortUrl = useMemo(() => {
    return urlQuery.data ? formatShortUrl(urlQuery.data.shortCode) : "";
  }, [urlQuery.data]);

  return {
    link: urlQuery.data,
    shortUrl,
    totalClicks,
    isLoading: urlQuery.isLoading,
    isClicksLoading: clicksQuery.isLoading,
    isError: urlQuery.isError,
    error: urlQuery.error || clicksQuery.error,
    refetch: async () => {
      await Promise.all([urlQuery.refetch(), clicksQuery.refetch()]);
    },
  };
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
      // Invalidate list and detail without unnecessarily invalidating clicks
      queryClient.invalidateQueries({ queryKey: urlKeys.lists() });
      queryClient.invalidateQueries({ queryKey: urlKeys.detail(id) });
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
      queryClient.removeQueries({ queryKey: urlKeys.clicksByUrl(deletedId) });
      queryClient.invalidateQueries({ queryKey: urlKeys.lists() });
      queryClient.invalidateQueries({ queryKey: urlKeys.clicks() });
    },
  });
}
