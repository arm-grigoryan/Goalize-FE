import HomeUpcaminMatchesCard from "@/entities/HomeUpcaminMatchesCard";
import styles from "./page.module.css";
import HomePastMatchesCard from "@/entities/HomePastMatchesCard";
import HomeTransferNewsCard from "@/entities/HomeTransferNewsCard";

export default function Home() {
  return (
    <div className={styles.page}>
      <HomeUpcaminMatchesCard />
      <div className={styles.Home_flex_container}>
        <HomePastMatchesCard />
        <HomeTransferNewsCard />
      </div>
    </div>
  );
}
