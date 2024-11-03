import Head from 'next/head';
import { attributes, react as HomeContent } from '../content/issue-1.md';
import styles from '../styles/Issue-1.module.css';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import birthdays from '../public/birthdays.json';
import Carousel from '../components/Carousel';

export default function Home() {
  const {
    title,
    subtitle,
    team,
    date,
    welcome,
    aboutProgram,
    sgmcImage,
    sgmcImageCaption,
    statistics,
    spotlight,
    tribalCouncil,
    chiefChat,
    recentSuccess,
    communityServiceCorner,
    photosOfMonth,
    events,
    thingsToDoInValdosta,
    employeeSpotlight,
    programDirector,
    wellnessTip,
  } = attributes;

  const [expandedChiefs, setExpandedChiefs] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [expandedRecentSuccess, setExpandedRecentSuccess] = useState(false);
  const [expandedCommunityService, setExpandedCommunityService] =
    useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
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

  const truncateRecentSuccess = (content) => {
    const maxLength = 240;
    if (content.length <= maxLength) return content;
    return content.substr(0, content.lastIndexOf(' ', maxLength)) + '...';
  };

  const truncateCommunityService = (content) => {
    const maxLength = 645;
    if (content.length <= maxLength) return content;
    return content.substr(0, content.lastIndexOf(' ', maxLength)) + '...';
  };

  const BirthdaySection = () => {
    const [currentMonthBirthdays, setCurrentMonthBirthdays] = useState([]);
    const [currentMonth, setCurrentMonth] = useState('');

    useEffect(() => {
      const currentDate = new Date();
      const monthName = currentDate.toLocaleString('default', {
        month: 'long',
      });
      const currentMonthShort = currentDate.toLocaleString('default', {
        month: 'short',
      });

      setCurrentMonth(monthName);

      const filteredBirthdays = birthdays.staff
        .filter((birthday) => birthday.month === currentMonthShort)
        .sort((a, b) => a.day - b.day);

      setCurrentMonthBirthdays(filteredBirthdays);
    }, []);

    return (
      <div className={styles.birthdaySection}>
        <h2 className={styles.sectionTitle}>{currentMonth} Birthdays</h2>
        {currentMonthBirthdays.length > 0 ? (
          <ul className={styles.birthdayList}>
            {currentMonthBirthdays.map((birthday, index) => (
              <li key={index} className={styles.birthdayItem}>
                <strong>{birthday.name}:</strong> {birthday.day}{' '}
                {birthday.month}
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
          content='SGMC Health IM Residency Newsletter'
        />
        <meta property='og:title' content={title} />
        <meta
          property='og:description'
          content='SGMC Health IM Residency Newsletter'
        />
        <meta
          property='og:image'
          content='https://azaleareport.com/img/sgmchealth.jpeg'
        />
        <meta property='og:url' content='https://azaleareport.com' />
        <meta property='og:type' content='website' />
        <link rel='manifest' href='/manifest.json' />
        <link
          href='https://fonts.googleapis.com/css2?family=Anton&display=swap'
          rel='stylesheet'
        />
        <script
          defer
          data-domain='azaleareport.com'
          src='https://plausible.io/js/script.js'
        ></script>
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
            <div
              className={styles.text}
              dangerouslySetInnerHTML={{
                __html: welcome,
              }}
            />
            <div className={styles.text}>{team}</div>
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
                <small className={styles.sgmcImageCaption}>
                  {sgmcImageCaption}
                </small>
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

          <section className={styles.fullWidth}>
            <h2 className={styles.sectionTitle}>The Chiefs' Corner</h2>
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
            <h2 className={styles.sectionTitle}>
              Message from the Program Director
            </h2>
            <div className={styles.programDirectorSection}>
              <img
                src={programDirector.image}
                alt={programDirector.name}
                className={styles.programDirectorImage}
              />
              <div className={styles.programDirectorContent}>
                <h2 className={styles.programDirectorName}>
                  {programDirector.name}
                </h2>
                <p className={styles.programDirectorTitle}>
                  {programDirector.title}
                </p>
                <div
                  className={styles.programDirectorMessage}
                  dangerouslySetInnerHTML={{ __html: programDirector.message }}
                />
              </div>
            </div>
          </section>

          <section className={styles.fullWidth}>
            <h2 className={styles.sectionTitle}>Recent Success</h2>
            <div className={styles.recentSuccessContent}>
              <h3 className={styles.recentSuccessTitle}>
                {recentSuccess.title}
              </h3>
              <div className={styles.recentSuccessImageWrapper}>
                <img
                  src={recentSuccess.image}
                  alt='Recent success highlight'
                  className={styles.recentSuccessImage}
                />
                <small className={styles.recentSuccessCaption}>
                  {recentSuccess.imageCaption}
                </small>
              </div>
              <div
                className={styles.recentSuccessText}
                dangerouslySetInnerHTML={{ __html: recentSuccess.content }}
              />
              <h3 className={styles.recentSuccessTitle}>
                Poster Presentation Highlights
              </h3>
              <Carousel
                images={recentSuccess.posterImage}
                interval={12000}
                aspectRatio='1:1'
              />
            </div>
          </section>

          <section className={styles.fullWidth}>
            <h2 className={styles.sectionTitle}>Community Service Corner</h2>
            <div className={styles.communityServiceCornerContent}>
              <h3 className={styles.communityServiceCornerTitle}>
                {communityServiceCorner.title}
              </h3>
              <div className={styles.communityServiceCornerSubTitle}>
                By: {communityServiceCorner.author}
              </div>
              <div className={styles.communityServiceCornerImageWrapper}>
                <img
                  src={communityServiceCorner.image}
                  alt='Community service highlight'
                  className={styles.communityServiceCornerImage}
                />
                <small className={styles.communityServiceCornerCaption}>
                  {communityServiceCorner.imageCaption}
                </small>
              </div>
              <div className={styles.communityServiceCornerText}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: expandedCommunityService
                      ? communityServiceCorner.content
                      : truncateCommunityService(
                          communityServiceCorner.content
                        ),
                  }}
                />
                {communityServiceCorner.content.length > 240 && (
                  <button
                    onClick={() =>
                      setExpandedCommunityService(!expandedCommunityService)
                    }
                    className={styles.communityServiceCornerToggleButton}
                  >
                    {expandedCommunityService ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
            </div>
          </section>

          <section className={styles.fullWidth}>
            <h2 className={styles.lensSectionTitle}>
              Through the Lens: Residency Highlights
            </h2>
            <p className={styles.lensSectionSubTitle}>
              Capturing the Smiles, Milestones, and Unforgettable Moments
            </p>
            <Carousel images={photosOfMonth} interval={8000} />
          </section>

          <section className={styles.twoColumns}>
            <div className={styles.column}>
              <h2 className={styles.sectionTitle}>Upcoming Events</h2>
              <ul className={styles.eventList}>
                {events.map((event, index) => (
                  <li key={index} className={styles.eventItem}>
                    <strong>{event.date} - </strong> {event.description}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.column}>
              <BirthdaySection />
            </div>
          </section>

          <section className={styles.fullWidth}>
            <h2 className={styles.sectionTitle}>Things to Do in Valdosta</h2>
            <Carousel
              images={thingsToDoInValdosta.images.map((image) => ({ image }))}
              interval={8000}
              showCaption={false}
              showArrows={false}
            />
            <ul className={styles.thingsToDoList}>
              {thingsToDoInValdosta.items.map((item, index) => (
                <li key={index} className={styles.thingsToDoItem}>
                  <h3 className={styles.thingsToDoTitle}>{item.title}</h3>
                  <p className={styles.thingsToDoDate}>{item.date}</p>
                  <p className={styles.thingsToDoDescription}>
                    {item.description}
                  </p>
                  <a
                    href={item.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={styles.thingsToDoLink}
                  >
                    Learn More
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.fullWidth}>
            <div className={styles.spotlightIconContainer}>
              <Image
                src='/img/spotlight.svg'
                alt='Spotlight'
                width={50}
                height={50}
                className={styles.spotlightIcon}
              />
              <h2 className={styles.newsFromClinic}>News from the clinic</h2>
            </div>
            <div className={styles.employeeSpotlightContainer}>
              <div className={styles.employeeSpotlightImageContainer}>
                <img
                  src={
                    employeeSpotlight.image || '/img/employee-placeholder.jpg'
                  }
                  alt={employeeSpotlight.name}
                  className={styles.employeeSpotlightImage}
                />
                <h3 className={styles.employeeName}>
                  {employeeSpotlight.name}
                </h3>
                <p className={styles.employeeTitle}>
                  {employeeSpotlight.title}
                </p>
              </div>
              <div className={styles.employeeSpotlightText}>
                <h3 className={styles.employeeSpotlightHeader}>
                  Employee Spotlight
                </h3>
                <div className={styles.employeeSpotlightDivider}></div>
                <p className={styles.employeeSpotlightDescription}>
                  {employeeSpotlight.description}
                </p>
              </div>
            </div>
          </section>

          <section className={styles.fullWidth}>
            <h2 className={styles.sectionTitle}>Wellness corner</h2>
            <div className={styles.wellnessTipSection}>
              <h2 className={styles.wellnessTipTitle}>{wellnessTip.title}</h2>
              <div className={styles.wellnessTipContent}>
                <div className={styles.wellnessTipText}>
                  <div
                    dangerouslySetInnerHTML={{ __html: wellnessTip.content }}
                  />
                </div>
                <img
                  src={wellnessTip.image}
                  alt='Healthy eating'
                  className={styles.wellnessTipImage}
                />
              </div>
            </div>
          </section>

          <HomeContent />
        </main>

        <footer className={styles.footer}>
          <p>
            © {new Date().getFullYear()} Azalea Report - SGMC Health Internal
            Medicine Residency Newsletter
          </p>
        </footer>
      </div>
    </div>
  );
}
