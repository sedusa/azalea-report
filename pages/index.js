import Head from "next/head"
import { attributes, react as HomeContent } from '../content/home.md'
import styles from '../styles/Home.module.css'
import Image from 'next/image'

export default function Home() {
  const { title, subtitle, team, date, welcome, aboutProgram, sgmcImage, statistics, spotlight, tribalCouncil, chiefChat, farewell, photoOfMonth, events } = attributes

  return (
    <div className={styles.pageBackground}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Georgia&family=Arial&display=swap" rel="stylesheet" />
      </Head>

      <div className={styles.container}>
        <main className={styles.main}>
          <header className={styles.header}>
            <div className={styles.logoContainer}>
              <Image src="/img/azalea.svg" alt="azalea-logo" width={150} height={150} className={styles.logo} />
            </div>
            <div className={styles.titleContainer}>
              <h1 className={styles.title}>{title}</h1>
              <p className={styles.subtitle}>{subtitle}</p>
              <p className={styles.date}>{date}</p>
            </div>
          </header>

          <section className={styles.fullWidth}>
            <h2 className={styles.sectionTitle}>Welcome</h2>
            <p className={styles.text}>{welcome}</p>
            <p className={styles.text}>{team}</p>
          </section>

          <section className={styles.twoColumns}>
            <div className={styles.column}>
              <h2 className={styles.sectionTitle}>Resident Spotlight</h2>
              <div className={styles.spotlightContainer}>
                <img src={spotlight.image} alt={spotlight.name} className={styles.spotlightImage} />
                <h3 className={styles.spotlightName}>{spotlight.name}</h3>
                <p className={styles.spotlightText}><strong>Birth place:</strong> {spotlight.birthplace}</p>
                <p className={styles.spotlightText}><strong>Fun fact:</strong> {spotlight.funFact}</p>
                <p className={styles.spotlightText}><strong>Favorite dish:</strong> {spotlight.favoriteDish}</p>
                <p className={styles.spotlightText}><strong>Interests:</strong> {spotlight.interests}</p>
                <p className={styles.spotlightText}><strong>Post-residency Plans:</strong> {spotlight.postResidencyPlans}</p>
              </div>
            </div>
            <div className={styles.column}>
              <div className={styles.aboutProgram}>
                <h2 className={styles.sectionTitle}>About the Program</h2>
                <img src={sgmcImage} alt="SGMC Building" className={styles.sgmcImage} />
                <p className={styles.text}>{aboutProgram}</p>
                
              </div>
              
              <h2 className={styles.sectionTitle}>Program Statistics</h2>
              <ul className={styles.list}>
                <li className={styles.listItem}>Number of current residents: {statistics.residentCount}</li>
                <li className={styles.listItem}>Our diversity: Residents from {statistics.countryCount} different countries</li>
                <li className={styles.listItem}>Number of languages: We speak {statistics.languageCount} different languages</li>
              </ul>
            </div>
          </section>

          {/* <section className={styles.fullWidth}>
            <h2>Tribal Council Corner</h2>
            <div dangerouslySetInnerHTML={{ __html: tribalCouncil.content }} />
          </section> */}

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
            <h2 className={styles.sectionTitle}>Farewell</h2>
            <div className={styles.farewellContent}>
              <img src="/img/kevin-farewell.jpg" alt="Farewell to Kevin" className={styles.farewellImage} />
              <div className={styles.farewellText} dangerouslySetInnerHTML={{ __html: farewell.content }} />
            </div>
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
          <p>© {new Date().getFullYear()} Azalea Report - The SGMC Internal Medicine Residency Newsletter</p>
        </footer>
      </div>
    </div>
  )
}