import Head from 'next/head';
import { attributes, react as HomeContent } from '../content/home.md';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import birthdays from '../public/birthdays.json';

export default function Home() {
  const {
    title,
    subtitle,
    team,
    date,
    welcome,
    aboutProgram,
    sgmcImage,
    statistics,
    spotlight,
    tribalCouncil,
    chiefChat,
    farewell,
    photoOfMonth,
    events,
    upcomingBirthdays,
    employeeSpotlight,
    programDirector,
  } = attributes;

  const [expandedChiefs, setExpandedChiefs] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [expandedFarewell, setExpandedFarewell] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Call it initially
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleChiefContent = (index) => {
    setExpandedChiefs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const truncateContent = (content, maxLength = isMobile ? 200 : 450) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, content.lastIndexOf(' ', maxLength)) + '...';
  };

  const truncateFarewell = (content, maxWords = 50) => {
    const div = document.createElement('div');
    div.innerHTML = content;
    const text = div.textContent || div.innerText;
    const words = text.split(/\s+/);
    if (words.length <= maxWords) return content;

    const truncatedText = words.slice(0, maxWords).join(' ') + '...';
    return `<p>${truncatedText}</p>`;
  };

  const BirthdaySection = () => {
    const [currentMonthBirthdays, setCurrentMonthBirthdays] = useState([]);
    const [currentMonth, setCurrentMonth] = useState('');

    useEffect(() => {
      const currentDate = new Date();
      const monthName = currentDate.toLocaleString('default', { month: 'long' });
      const currentMonthShort = currentDate.toLocaleString('default', { month: 'short' });

      setCurrentMonth(monthName);

      const filteredBirthdays = birthdays.staff.filter(
        (birthday) => birthday.month === currentMonthShort
      ).sort((a, b) => a.day - b.day);

      setCurrentMonthBirthdays(filteredBirthdays);
    }, []);

    return (
      <div className={styles.birthdaySection}>
        <h2 className={styles.sectionTitle}>{currentMonth} Birthdays</h2>
        {currentMonthBirthdays.length > 0 ? (
          <ul className={styles.birthdayList}>
            {currentMonthBirthdays.map((birthday, index) => (
              <li key={index} className={styles.birthdayItem}>
                <strong>{birthday.name}:</strong> {birthday.day} {birthday.month}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.birthdayItem}>No birthdays this month 😞</p>
        )}
      </div>
    );
  };

  return (
    <div className={styles.pageBackground}>
      <Head>
        <title>{title}</title>
        <link rel='icon' href='/favicon.ico' />
        <link
          href='https://fonts.googleapis.com/css2?family=Georgia&family=Arial&display=swap'
          rel='stylesheet'
        />

        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
        <link rel='manifest' href='/site.webmanifest' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />
        <meta name='msapplication-TileColor' content='#da532c' />
        <meta name='theme-color' content='#ffffff' />
        <meta
          name='description'
          content='SGMC HealthInternal Medicine Residency Newsletter'
        />
        <meta property='og:title' content={title} />
        <meta
          property='og:description'
          content='SGMC HealthInternal Medicine Residency Newsletter'
        />
        <meta
          property='og:image'
          content='https://azaleareport.netlify.app/img/azalea.svg'
        />
        <meta property='og:url' content='https://azaleareport.netlify.app/' />
        <meta property='og:type' content='website' />
        <link rel='manifest' href='/manifest.json' />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className={styles.container}>
        <main className={styles.main}>
          <header className={styles.header}>
            <div className={styles.logoContainer}>
              <Image
                src='/img/azalea.svg'
                alt='azalea-logo'
                width={150}
                height={150}
                className={styles.logo}
              />
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
                <img
                  src={spotlight.image}
                  alt={spotlight.name}
                  className={styles.spotlightImage}
                />
                <h3 className={styles.spotlightName}>{spotlight.name}</h3>
                <p className={styles.spotlightText}>
                  <strong>Birth place:</strong> {spotlight.birthplace}
                </p>
                <p className={styles.spotlightText}>
                  <strong>Fun fact:</strong> {spotlight.funFact}
                </p>
                <p className={styles.spotlightText}>
                  <strong>Favorite dish:</strong> {spotlight.favoriteDish}
                </p>
                <p className={styles.spotlightText}>
                  <strong>Interests:</strong> {spotlight.interests}
                </p>
                <p className={styles.spotlightText}>
                  <strong>Post-residency plans:</strong>{' '}
                  {spotlight.postResidencyPlans}
                </p>
              </div>
            </div>
            <div className={styles.column}>
              <div className={styles.aboutProgram}>
                <h2 className={styles.sectionTitle}>About the Program</h2>
                <img
                  src={sgmcImage}
                  alt='SGMC Building'
                  className={styles.sgmcImage}
                />
                <p className={styles.text}>{aboutProgram}</p>
              </div>

              <h2 className={styles.sectionTitle}>Program Statistics</h2>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  Number of current residents: {statistics.residentCount}
                </li>
                <li className={styles.listItem}>
                  Our diversity: Residents from {statistics.countryCount}{' '}
                  different countries
                </li>
                <li className={styles.listItem}>
                  Number of languages: We speak {statistics.languageCount}{' '}
                  different languages
                </li>
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
                  <img
                    src={chief.image}
                    alt={chief.name}
                    className={styles.chiefImage}
                  />
                  <h3 className={styles.chiefName}>{chief.name}</h3>
                  <div className={styles.chiefText}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: expandedChiefs[index]
                          ? chief.content
                          : truncateContent(chief.content),
                      }}
                    />
                    {chief.content.length > (isMobile ? 200 : 450) && (
                      <button
                        onClick={() => toggleChiefContent(index)}
                        className={styles.toggleButton}
                      >
                        {expandedChiefs[index] ? 'Show Less' : 'Show More'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.fullWidth}>
          <h2 className={styles.sectionTitle}>Message from the Program Director</h2>
            <div className={styles.programDirectorSection}>
              <img
                src={programDirector.image}
                alt={programDirector.name}
                className={styles.programDirectorImage}
              />
              <div className={styles.programDirectorContent}>
                <h2 className={styles.programDirectorName}>{programDirector.name}</h2>
                <p className={styles.programDirectorTitle}>{programDirector.title}</p>
                <div
                  className={styles.programDirectorMessage}
                  dangerouslySetInnerHTML={{ __html: programDirector.message }}
                />
              </div>
            </div>
          </section>

          <section className={styles.fullWidth}>
            <h2 className={styles.sectionTitle}>Farewell</h2>
            <div className={styles.farewellContent}>
              <img
                src='/img/flare.jpeg'
                alt='Farewell placeholder image'
                className={styles.farewellImage}
              />
              <div className={styles.farewellText}>
                {isMobile ? (
                  <>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: expandedFarewell
                          ? farewell.content
                          : truncateFarewell(farewell.content),
                      }}
                    />
                    <button
                      onClick={() => setExpandedFarewell(!expandedFarewell)}
                      className={styles.farewellToggleButton}
                    >
                      {expandedFarewell ? 'Show Less' : 'Show More'}
                    </button>
                  </>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: farewell.content }} />
                )}
              </div>
            </div>
          </section>

          <section className={styles.fullWidth}>
            <h2 className={styles.sectionTitle}>Photo of the Month</h2>
            <img
              src={photoOfMonth.image}
              alt={photoOfMonth.caption}
              className={styles.photoOfMonth}
            />
            <p className={styles.photoCaption}>{photoOfMonth.caption}</p>
          </section>

          <section className={styles.twoColumns}>
            <div className={styles.column}>
              <h2 className={styles.sectionTitle}>Upcoming Events</h2>
              <ul className={styles.eventList}>
                {events.map((event, index) => (
                  <li key={index} className={styles.eventItem}>
                    <strong>{event.date}:</strong> {event.description}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.column}>
              <BirthdaySection />
            </div>
          </section>

          <section className={styles.fullWidth}>
            <div className={styles.spotlightIconContainer}>
              <Image
                src="/img/spotlight.svg"
                alt="Spotlight"
                width={50}
                height={50}
                className={styles.spotlightIcon}
              />
              <h2 className={styles.newsFromClinic}>News from the clinic</h2>
            </div>
            <div className={styles.employeeSpotlightContainer}>
              <div className={styles.employeeSpotlightImageContainer}>
                <img
                  src={employeeSpotlight.image || '/img/employee-placeholder.jpg'}
                  alt={employeeSpotlight.name}
                  className={styles.employeeSpotlightImage}
                />
                <h3 className={styles.employeeName}>{employeeSpotlight.name}</h3>
                <p className={styles.employeeTitle}>{employeeSpotlight.title}</p>
              </div>
              <div className={styles.employeeSpotlightText}>
                <h3 className={styles.employeeSpotlightHeader}>Employee Spotlight</h3>
                <div className={styles.employeeSpotlightDivider}></div>
                <p className={styles.employeeSpotlightDescription}>{employeeSpotlight.description}</p>
              </div>
            </div>
          </section>

          <HomeContent />
        </main>

        <footer className={styles.footer}>
          <p>
            © {new Date().getFullYear()} Azalea Report - The SGMC Internal
            Medicine Residency Newsletter
          </p>
        </footer>
      </div>
    </div>
  );
}
