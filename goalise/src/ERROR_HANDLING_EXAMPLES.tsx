import { useEffect } from "react";
import { useHandle404 } from "@/hooks/useErrorHandling";
import { useGetPlayerBasicInfoQuery } from "@/app/store/services/api";

/**
 * EXAMPLE 1: Handle 404 and 403 for entity detail pages
 *
 * Use this pattern when loading an entity that might not exist or be inaccessible
 * Examples: /players/[playerId], /leagues/[leagueId], /teams/[teamId]
 */
export function ExampleEntityDetailPage({ entityId }: { entityId: number }) {
  const handle404 = useHandle404();

  // Load entity data
  const { data, error, isLoading } = useGetPlayerBasicInfoQuery(entityId);

  // Handle 404 and 403 errors
  useEffect(() => {
    if (error) {
      const wasHandled = handle404(error);
      if (!wasHandled) {
        // If it's not a 404 or 403, you can handle other errors here
        console.error("Other error:", error);
      }
    }
  }, [error, handle404]);

  if (isLoading) return <div>Loading...</div>;
  if (!data) return null; // Redirected by handle404

  return <div>Entity: {data.playerInfo?.userInfo.firstName}</div>;
}

/**
 * EXAMPLE 2: Handle 403 for action/button errors
 *
 * Use this when a button action (mutation) returns 403
 * The error is shown as a modal and doesn't navigate away
 */
import { useShowActionForbiddenError } from "@/hooks/useErrorHandling";
import { useSendTeamInvitationMutation } from "@/app/store/services/api";

export function ExampleActionButtonComponent() {
  const showForbiddenError = useShowActionForbiddenError();
  const [sendInvitation, { isLoading }] = useSendTeamInvitationMutation();

  const handleInviteClick = async () => {
    try {
      await sendInvitation({ teamId: 1, playerId: 2 }).unwrap();
      // Show success - you can handle this with your own success modal
      console.log("Invitation sent successfully!");
    } catch (error) {
      if (error && typeof error === "object" && "status" in error) {
        if (error.status === 403) {
          // Show the "not allowed" modal
          showForbiddenError();
        } else if (error.status === 400) {
          // Handle validation errors
          console.error("Validation error:", error);
        } else {
          // Other errors (5xx are auto-handled by global banner)
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

/**
 * EXAMPLE 3: 401 Unauthorized (Automatic)
 *
 * NO CODE NEEDED! This is handled automatically:
 * - User token expires
 * - API call returns 401
 * - AuthContext is notified
 * - User is redirected to /signin-oidc
 *
 * The handle401Error function in api.ts takes care of this.
 */

/**
 * EXAMPLE 4: 5xx Server Errors (Automatic)
 *
 * NO CODE NEEDED! This is handled automatically:
 * - Any API call returns 5xx status
 * - GlobalErrorDisplay component shows a banner at top
 * - User can dismiss the banner
 * - No navigation happens
 *
 * If needed, you can manually trigger:
 */
import { useShowServerError } from "@/hooks/useErrorHandling";

export function ExampleManualServerError() {
  const showServerError = useShowServerError();

  const someAsyncOperation = async () => {
    try {
      // Some operation
    } catch (error) {
      if (error && typeof error === "object" && "status" in error) {
        const status = error.status;
        if (typeof status === "number" && status >= 500) {
          showServerError(); // Manually show banner
        }
      }
    }
  };

  return <button onClick={someAsyncOperation}>Do Something</button>;
}
