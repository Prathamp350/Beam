import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import { UserCheckIcon } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";

const DEFAULT_AVATAR = "/default-avatar.png"; // add this file to public folder

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading, isError, error } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    retry: false,
  });

  const { mutate: acceptRequestMutation, isLoading: isMutating } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-2">Failed to load notifications.</p>
        <p className="text-sm opacity-70">
          {error?.message ?? "Please refresh or log in again."}
        </p>
      </div>
    );
  }

  if (friendRequests === null) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg">You are not logged in.</p>
        <p className="text-sm opacity-70">
          Please log in to see your notifications.
        </p>
      </div>
    );
  }

  const incomingRequests = friendRequests?.incomingReqs ?? [];
  const noNotifications = incomingRequests.length === 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Notifications
        </h1>

        {/* Friend Requests */}
        {incomingRequests.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <UserCheckIcon className="h-5 w-5 text-primary" />
              Friend Requests
              <span className="badge badge-primary ml-2">
                {incomingRequests.length}
              </span>
            </h2>

            <div className="space-y-3">
              {incomingRequests.map((request) => {
                const sender = request?.sender ?? {};
                return (
                  <div
                    key={request?._id ?? Math.random()}
                    className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="card-body p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="avatar w-14 h-14 rounded-full bg-base-300">
                            <img
                              src={sender.profilePic ?? DEFAULT_AVATAR}
                              alt={sender.fullName ?? "User"}
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {sender.fullName ?? "Unknown User"}
                            </h3>
                            <div className="flex flex-wrap gap-1.5 mt-1">
                              <span className="badge badge-secondary badge-sm">
                                Native: {sender.nativeLanguage ?? "—"}
                              </span>
                              <span className="badge badge-outline badge-sm">
                                Learning: {sender.learningLanguage ?? "—"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => acceptRequestMutation(request._id)}
                          disabled={isMutating}
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* No Notifications Message */}
        {noNotifications && <NoNotificationsFound />}
      </div>
    </div>
  );
};

export default NotificationsPage;
