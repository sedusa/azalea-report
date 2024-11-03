import { useState, useEffect } from 'react';
import { attributes } from '../content/home.md';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import Layout from '../app/Layout';
import birthdays from '../public/birthdays.json';
import TwoColumnLayout from '../components/types/TwoColumnLayout';
import SingleColumnLayout from '../components/types/SingleColumnLayout';
import ResidentSpotlight from '../components/sections/ResidentSpotlight';
import ProgramInfo from '../components/sections/ProgramInfo';
import ChiefsCorner from '../components/sections/ChiefsCorner';
import ProgramDirector from '../components/sections/ProgramDirector';
import RecentSuccess from '../components/sections/RecentSuccess';
import CommunityService from '../components/sections/CommunityService';
import PhotosOfTheMonth from '../components/sections/PhotosOfMonth';
import UpcomingEvents from '../components/sections/UpcomingEvents';
import BirthdaySection from '../components/sections/BirthdaySection'
import ThingsToDo from '../components/sections/ThingsToDo';
import Carousel from '../components/Carousel';


export default function Home() {
  const {
    program,
    spotlight,
    tribalCouncil,
    chiefsCorner,
    programDirector,
    recentSuccess,
    communityServiceCorner,
    photosOfMonth,
    events,
    thingsToDo,
    employeeSpotlight,
    wellnessTip,
  } = attributes;

  const [isMobile, setIsMobile] = useState(false);
  
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

  return (
    <Layout>
      <TwoColumnLayout
        leftColumn={<ResidentSpotlight spotlight={spotlight} />}
        rightColumn={<ProgramInfo program={program} />}
      />
      <SingleColumnLayout
        column={<ChiefsCorner chiefsCorner={chiefsCorner} />}
      />
      <SingleColumnLayout
        column={<ProgramDirector programDirector={programDirector} />}
      />
      <SingleColumnLayout
        column={<RecentSuccess recentSuccess={recentSuccess} />}
      />
      <SingleColumnLayout
        column={<CommunityService communityServiceCorner={communityServiceCorner} />}
      />
      <SingleColumnLayout
        column={<PhotosOfTheMonth photosOfMonth={photosOfMonth} />}
      />
      <TwoColumnLayout
        leftColumn={<UpcomingEvents events={events} />}
        rightColumn={<BirthdaySection birthdays={birthdays} />}
      />
      <SingleColumnLayout
        column={<ThingsToDo thingsToDo={thingsToDo} />}
      />

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
              src={employeeSpotlight.image || '/img/employee-placeholder.jpg'}
              alt={employeeSpotlight.name}
              className={styles.employeeSpotlightImage}
            />
            <h3 className={styles.employeeName}>{employeeSpotlight.name}</h3>
            <p className={styles.employeeTitle}>{employeeSpotlight.title}</p>
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
              <div dangerouslySetInnerHTML={{ __html: wellnessTip.content }} />
            </div>
            <img
              src={wellnessTip.image}
              alt='Healthy eating'
              className={styles.wellnessTipImage}
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}
