import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
  getPastNotifications,
  getTodayNotifications,
  hasUnreadNotifications,
  readNotification,
} from "@/services/notification";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const notificationsKeys = {
  all: ["notifications"] as const,
  list: (userId: string) => [...notificationsKeys.all, userId] as const,
  today: (userId: string) =>
    [...notificationsKeys.all, userId, "today"] as const,
  past: (userId: string) => [...notificationsKeys.all, userId, "past"] as const,
  hasUnreadNotifications: (userId: string) =>
    [...notificationsKeys.all, userId, "hasUnreadNotifications"] as const,
};

export function useNotifications(userId: string) {
  return useQuery({
    queryKey: notificationsKeys.list(userId),
    queryFn: () => getNotifications(userId),
    enabled: !!userId,
  });
}

export function useNotificationsSuspenseQuery(userId: string) {
  return useSuspenseQuery({
    queryKey: notificationsKeys.list(userId),
    queryFn: () => getNotifications(userId),
  });
}

export function useTodayNotificationsSuspenseQuery(userId: string) {
  return useSuspenseQuery({
    queryKey: notificationsKeys.today(userId),
    queryFn: () => getTodayNotifications(userId),
  });
}

export function usePastNotificationsSuspenseQuery(userId: string) {
  return useSuspenseQuery({
    queryKey: notificationsKeys.past(userId),
    queryFn: () => getPastNotifications(userId),
  });
}

export function useDeleteNotificationMutation(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationsKeys.list(userId),
      });
      queryClient.invalidateQueries({
        queryKey: notificationsKeys.today(userId),
      });
      queryClient.invalidateQueries({
        queryKey: notificationsKeys.past(userId),
      });
    },
  });
}

export function useDeleteAllNotificationsMutation(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteAllNotifications(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationsKeys.list(userId),
      });
      queryClient.invalidateQueries({
        queryKey: notificationsKeys.today(userId),
      });
      queryClient.invalidateQueries({
        queryKey: notificationsKeys.past(userId),
      });
    },
  });
}

export function useReadNotificationMutation(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: readNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationsKeys.list(userId),
      });
    },
  });
}

export function useHasUnreadNotificationsQuery(userId: string) {
  return useQuery({
    queryKey: notificationsKeys.hasUnreadNotifications(userId),
    queryFn: () => hasUnreadNotifications(userId),
    enabled: !!userId && userId.length > 0,
  });
}
