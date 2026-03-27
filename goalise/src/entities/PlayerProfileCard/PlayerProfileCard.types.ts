import { StaticImageData } from "next/image";

export interface IUsersProps {
  id?: string;
  email?: string;
  emailConfirmed?: boolean;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  profilePic?: string;
  profilePicStatus?: string;
  profilePicRejectionReason?: string;
  profilePicUploadedAt?: string;
  profilePicReviewedAt?: string;
  birthDate?: string;
  workingFoot?: string;
  profileCompletionInfo?: {
    steps?: [
      {
        name?: string;
        iconUrl?: string;
        percentage?: number;
        completed?: boolean;
      }
    ];
    totalSteps?: number;
    completedSteps?: number;
    percentage?: number;
  };
}

export interface IPlayerProfileProps {
  isLoggedIn?: boolean;
  profilePic?: string | StaticImageData;
  phoneNumber: string | null;
  playerNumber?: string;
  inviteButtonText?: string;
  fullName?: string;
  age?: string;
  foot?: string;
  makeCaptainButtonText?: string;
  onInviteButtonClick?: () => void;
  onMakeCaptainButtonClick?: () => void;
  onRemoveUserButtonClick?: () => void;
  teamLogo?: string | StaticImageData;
  teamName?: string;
  isCaptain?: boolean;
  isSameTeam?: boolean;
  isViewingSelf?: boolean;
  quitTeamButtonText?: string;
  onQuitTeamButtonClick?: () => void;
  playerHasTeam?: boolean;
  teamId?: number;
}
