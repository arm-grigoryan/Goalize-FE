import HomeUpcaminMatchesCard from "@/entities/HomeUpcaminMatchesCard";
import Header from "../components/generalComponents/Header";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Header />
      <HomeUpcaminMatchesCard />
    </div>
  );
}
