import HomeUpcomingMatchesCard from "@/components/HomeUpcomingMatchesCard";
import styles from "./page.module.css";
import HomePastMatchesCard from "@/components/HomePastMatchesCard";
import HomeTransferNewsCard from "@/components/HomeTransferNewsCard";
import ProfileComplitions from "@/components/ProfileComplitions";

export default function Home() {
  return (
    <div className={styles.page}>
      <ProfileComplitions />
      <HomeUpcomingMatchesCard />
      <div className={styles.Home_flex_container}>
        <HomePastMatchesCard />
        <HomeTransferNewsCard />
      </div>
    </div>
  );
}
