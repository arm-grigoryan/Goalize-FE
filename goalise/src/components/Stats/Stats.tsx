"use client"
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import StatsCard from "@/entities/StatsCard";
import { IStatsCardInnerCardProps } from "@/entities/StatsCardInnerCard/StatsCardInnerCard.types";
import { useWindowSize } from "@/hooks/useWindowSize";
import React from "react";
import styles from './Stats.module.css';

export const Stats: React.FC = () => {
   const { width } = useWindowSize();
   const isMobile = width <= MEDIA_TABLET_SMALL;

  const obj = [
    {
      teamPlayer: {
        firstName: "PLayer",
        lastName: "Name",
        picture: "string",
        shirtNumber: 10,
      },
      team: {
        name: "Team Name"
      },
      value: 10
    },
     {
      teamPlayer: {
        firstName: "PLayer",
        lastName: "Name",
        picture: "string",
        shirtNumber: 10,
      },
      team: {
        name: "Team Name"
      },
      value: 10
    },
     {
      teamPlayer: {
        firstName: "PLayer",
        lastName: "Name",
        picture: "string",
        shirtNumber: 10,
      },
      team: {
        name: "Team Name"
      },
      value: 10
    },
     {
      teamPlayer: {
        firstName: "PLayer",
        lastName: "Name",
        picture: "string",
        shirtNumber: 10,
      },
      team: {
        name: "Team Name"
      },
      value: 10
    },
     {
      teamPlayer: {
        firstName: "PLayer",
        lastName: "Name",
        picture: "string",
        shirtNumber: 10,
      },
      team: {
        name: "Team Name"
      },
      value: 10
    },
     {
      teamPlayer: {
        firstName: "PLayer",
        lastName: "Name",
        picture: "string",
        shirtNumber: 10,
      },
      team: {
        name: "Team Name"
      },
      value: 10
    },
     {
      teamPlayer: {
        firstName: "PLayer",
        lastName: "Name",
        picture: "string",
        shirtNumber: 10,
      },
      team: {
        name: "Team Name"
      },
      value: 10
    },
     {
      teamPlayer: {
        firstName: "PLayer",
        lastName: "Name",
        picture: "string",
        shirtNumber: 10,
      },
      team: {
        name: "Team Name"
      },
      value: 10
    },
     {
      teamPlayer: {
        firstName: "PLayer",
        lastName: "Name",
        picture: "string",
        shirtNumber: 10,
      },
      team: {
        name: "Team Name"
      },
      value: 10
    },
     {
      teamPlayer: {
        firstName: "PLayer",
        lastName: "Name",
        picture: "string",
        shirtNumber: 10,
      },
      team: {
        name: "Team Name"
      },
      value: 10
    },
     {
      teamPlayer: {
        firstName: "PLayer",
        lastName: "Name",
        picture: "string",
        shirtNumber: 10,
      },
      team: {
        name: "Team Name"
      },
      value: 10
    },
     {
      teamPlayer: {
        firstName: "PLayer",
        lastName: "Name",
        picture: "string",
        shirtNumber: 10,
      },
      team: {
        name: "Team Name"
      },
      value: 10
    },
    ] as IStatsCardInnerCardProps[];
  return <div className={`${!isMobile ? styles.container : styles.mobileWrapper}`}>
    <StatsCard title="Title"  object={obj} />
    <StatsCard title="Assists" object={obj} />
    <StatsCard title="Ratings" object={obj} />
    <StatsCard title="YellowCards" object={obj} />
  </div>;
}