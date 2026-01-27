export interface IStatsCardInnerCardProps {
    teamPlayer: {
        firstName: string;
        lastName: string;
        picture: string | null;
        shirtNumber: number;
    };
    team?: {
        name: string;
        logoUrl: string;
        captainId: number;
    };
    value: number;
}