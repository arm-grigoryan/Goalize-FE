/**
 * ERROR HANDLING IMPLEMENTATION GUIDE
 *
 * This guide explains how to use the global error handling system.
 *
 * ============================================================
 * 1. HANDLING 404 ERRORS (Entity not found)
 * ============================================================
 *
 * Use this when a page loads an entity by ID that might not exist.
 * Examples: /players/[playerId], /leagues/[leagueId], /teams/[teamId]
 *
 * Implementation:
 *
 *   import { useHandle404 } from "@/hooks/useErrorHandling";
 *   import { useGetPlayerBasicInfoQuery } from "@/app/store/services/api";
 *
 *   export default function PlayerProfile({ playerId }: { playerId: number }) {
 *     const handle404 = useHandle404();
 *     const { data, error, isLoading } = useGetPlayerBasicInfoQuery(playerId);
 *
 *     // Check for 404 or 403 errors and redirect
 *     useEffect(() => {
 *       if (error) {
 *         handle404(error);
 *       }
 *     }, [error, handle404]);
 *
 *     if (isLoading) return <Loader />;
 *     if (!data) return null; // Will be handled by redirect above
 *
 *     return <div>Player info: {data.name}</div>;
 *   }
 *
 * ============================================================
 * 2. HANDLING 403 FOR BUTTON/ACTION ERRORS (Action forbidden)
 * ============================================================
 *
 * Use when a button click (mutation) returns 403.
 * Shows a modal: "You are not allowed to perform this action"
 * Does NOT navigate away.
 *
 * Implementation:
 *
 *   import { useShowActionForbiddenError } from "@/hooks/useErrorHandling";
 *   import { useSendTeamInvitationMutation } from "@/app/store/services/api";
 *
 *   export function PlayerCard() {
 *     const showForbiddenError = useShowActionForbiddenError();
 *     const [sendInvitation] = useSendTeamInvitationMutation();
 *
 *     const handleInviteClick = async () => {
 *       try {
 *         await sendInvitation({ teamId: 1, playerId: 2 }).unwrap();
 *         // Success - show success modal
 *       } catch (error) {
 *         if (error?.status === 403) {
 *           showForbiddenError();
 *         } else if (error?.status === 400) {
 *           // Handle other errors...
 *         }
 *       }
 *     };
 *
 *     return <button onClick={handleInviteClick}>Invite</button>;
 *   }
 *
 * ============================================================
 * 3. HANDLING 5xx SERVER ERRORS (Auto-shows as banner)
 * ============================================================
 *
 * Server errors (500, 502, 503, etc.) are automatically handled.
 * The GlobalErrorDisplay component in the layout shows a banner.
 *
 * You can manually trigger this if needed:
 *
 *   import { useShowServerError } from "@/hooks/useErrorHandling";
 *
 *   export function SomeComponent() {
 *     const showServerError = useShowServerError();
 *
 *     const handleSomething = async () => {
 *       try {
 *         // ...
 *       } catch (error) {
 *         if (error?.status >= 500) {
 *           showServerError();
 *         }
 *       }
 *     };
 *   }
 *
 * ============================================================
 * 4. AUTOMATIC ERROR HANDLING (No code needed)
 * ============================================================
 *
 * These are handled automatically:
 *
 * - 401 Unauthorized: Automatically clears tokens and redirects to login
 *   (The handle401Error function in api.ts handles this)
 *
 * - 5xx Server Errors: Global banner is shown automatically
 *   (No need to manually handle in components)
 *
 * - 404 Page Routes: Next.js default not-found page works
 *   (Use useHandle404 hook for API 404 responses)
 *
 * ============================================================
 * 5. PREVENTING UNNECESSARY `me` CALLS
 * ============================================================
 *
 * The useGetUserInfoQuery now checks for token presence before
 * calling the API. No changes needed in components - it's automatic!
 *
 * The query reads localStorage:
 * - If no token exists: Returns error (doesn't call API)
 * - If token exists: Calls API normally
 *
 * This prevents 401 errors on initial page load when user
 * is not authenticated.
 */
