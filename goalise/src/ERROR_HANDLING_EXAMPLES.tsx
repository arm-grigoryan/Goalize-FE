import { useEffect } from "react";
import { useHandle404 } from "@/hooks/useErrorHandling";
import { useGetPlayerBasicInfoQuery } from "@/app/store/services/api";

export function ExampleEntityDetailPage({ entityId }: { entityId: number }) {
  const handle404 = useHandle404();

  const { data, error, isLoading } = useGetPlayerBasicInfoQuery(entityId);

  useEffect(() => {
    if (error) {
      const wasHandled = handle404(error);
      if (!wasHandled) {
        console.error("Other error:", error);
      }
    }
  }, [error, handle404]);

  if (isLoading) return <div>Loading...</div>;
  if (!data) return null;

  return <div>Entity: {data.playerInfo?.userInfo.firstName}</div>;
}

import { useShowActionForbiddenError } from "@/hooks/useErrorHandling";
import { useSendTeamInvitationMutation } from "@/app/store/services/api";

export function ExampleActionButtonComponent() {
  const showForbiddenError = useShowActionForbiddenError();
  const [sendInvitation, { isLoading }] = useSendTeamInvitationMutation();

  const handleInviteClick = async () => {
    try {
      await sendInvitation({ teamId: 1, playerId: 2 }).unwrap();
      console.log("Invitation sent successfully!");
    } catch (error) {
      if (error && typeof error === "object" && "status" in error) {
        if (error.status === 403) {
          showForbiddenError();
        } else if (error.status === 400) {
          console.error("Validation error:", error);
        } else {
          console.error("Error:", error);
        }
      }
    }
  };

  return (
    <button onClick={handleInviteClick} disabled={isLoading}>
      {isLoading ? "Sending..." : "Invite"}
    </button>
  );
}

import { useShowServerError } from "@/hooks/useErrorHandling";

export function ExampleManualServerError() {
  const showServerError = useShowServerError();

  const someAsyncOperation = async () => {
    try {
    } catch (error) {
      if (error && typeof error === "object" && "status" in error) {
        const status = error.status;
        if (typeof status === "number" && status >= 500) {
          showServerError();
        }
      }
    }
  };

  return <button onClick={someAsyncOperation}>Do Something</button>;
}
