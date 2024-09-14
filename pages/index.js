import Head from "next/head"
import { attributes, react as HomeContent } from '../content/home.md'
import styles from '../styles/Home.module.css'

export default function Home() {
  const { title, date, welcome, statistics, spotlight, tribalCouncil, chiefChat, farewell, photoOfMonth, events } = attributes

  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <main className={styles.main}>
      <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.date}>{date}</p>
        </header>

        <section className={styles.fullWidth}>
          <h2 className={styles.sectionTitle}>Welcome</h2>
          <p className={styles.text}>{welcome}</p>
        </section>

        <section className={styles.twoColumns}>
          <div className={styles.column}>
            <h2 className={styles.sectionTitle}>Program Statistics</h2>
            <ul className={styles.list}>
              <li className={styles.listItem}>Number of current residents: {statistics.residentCount}</li>
              <li className={styles.listItem}>Our diversity: Residents from {statistics.countryCount} different countries</li>
              <li className={styles.listItem}>Number of languages: We speak {statistics.languageCount} different languages</li>
            </ul>
          </div>
          <div className={styles.column}>
            <h2 className={styles.sectionTitle}>Resident Spotlight</h2>
            <img src={spotlight.image} alt={spotlight.name} className={styles.image} />
            <h3 className={styles.spotlightName}>{spotlight.name}</h3>
            <p className={styles.text}><strong>Birth place:</strong> {spotlight.birthplace}</p>
            <p className={styles.text}><strong>Fun fact:</strong> {spotlight.funFact}</p>
            <p className={styles.text}><strong>Favorite dish:</strong> {spotlight.favoriteDish}</p>
            <p className={styles.text}><strong>Interests:</strong> {spotlight.interests}</p>
            <p className={styles.text}><strong>Post-residency Plans:</strong> {spotlight.postResidencyPlans}</p>
          </div>
        </section>

        <section className={styles.fullWidth}>
          <h2>Tribal Council Corner</h2>
          <div dangerouslySetInnerHTML={{ __html: tribalCouncil.content }} />
        </section>

        <section className={styles.fullWidth}>
        <h2 className={styles.sectionTitle}>Chat With Our Chiefs</h2>
        <div className={styles.chiefsSection}>
          {chiefChat.map((chief, index) => (
            <div key={index} className={styles.chiefColumn}>
              <img src={chief.image} alt={chief.name} className={styles.image} />
              <h3 className={styles.spotlightName}>{chief.name}</h3>
              <div className={styles.text} dangerouslySetInnerHTML={{ __html: chief.content }} />
            </div>
          ))}
        </div>
      </section>

        <section className={styles.fullWidth}>
          <h2>Farewell</h2>
          <div dangerouslySetInnerHTML={{ __html: farewell.content }} />
        </section>

        <section className={styles.fullWidth}>
          <h2>Photo of the Month</h2>
          <img src={photoOfMonth.image} alt={photoOfMonth.caption} className={styles.photoOfMonth} />
          <p>{photoOfMonth.caption}</p>
        </section>

        <section className={styles.fullWidth}>
          <h2>Upcoming Events</h2>
          <ul>
            {events.map((event, index) => (
              <li key={index}>
                <strong>{event.date}:</strong> {event.description}
              </li>
            ))}
          </ul>
        </section>

        <HomeContent />
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} SGMC Internal Medicine Residency Newsletter</p>
      </footer>
    </div>
  )
}