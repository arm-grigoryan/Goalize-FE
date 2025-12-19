import { RefObject } from "react";

export interface ISearchCardProps {
    open?: boolean;
    inputRef?: RefObject<HTMLInputElement | null>;
}