import DrowStandings from "@/components/DrowStandings";
import styles from './page.module.css';
import Image from "next/image";
import infoIcon from '../../../../assets/pngs/infoIcon.svg';
import NoteLabel from "@/entities/NoteLabel";

export default function LeaguesDrawStandingsPage() {
  return (
    <div>
      <NoteLabel />
      <DrowStandings />
    </div>
  );
}
