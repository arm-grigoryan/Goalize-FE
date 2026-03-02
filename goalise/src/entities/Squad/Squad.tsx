import React from "react";
import SquadCard from "../SquadCard";
import styles from './Squad.module.css';

export const Squad: React.FC= () => {
    return <div className={styles.container}>
        <SquadCard 
            teamName={'AFC Bournemouth'}
            playerNumber={'11'}
        />
        <SquadCard 
            teamName={'AFC Bournemouth'}
            playerNumber={'11'}
        />
        <SquadCard 
            teamName={'AFC Bournemouth'}
            playerNumber={'11'}
        />
        <SquadCard 
            teamName={'AFC Bournemouth'}
            playerNumber={'11'}
        />
        <SquadCard 
            teamName={'AFC Bournemouth'}
            playerNumber={'11'}
        />
    </div>
}