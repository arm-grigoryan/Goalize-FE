import HomeUpcaminMatchesCard from "@/components/HomeUpcaminMatchesCard";
import styles from "./page.module.css";
import HomePastMatchesCard from "@/components/HomePastMatchesCard";
import HomeTransferNewsCard from "@/components/HomeTransferNewsCard";

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
