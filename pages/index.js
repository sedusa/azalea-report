import Head from 'next/head';
import { attributes } from '@content/home.md';
import Layout from '@app/Layout';
import birthdays from '@public/birthdays.json';
import TwoColumnLayout from '@components/types/TwoColumnLayout';
import SingleColumnLayout from '@components/types/SingleColumnLayout';
import Banner from '@/components/Banner';
import AboutSection from '@/components/sections/AboutSection';
import ResidentSpotlight from '@components/sections/ResidentSpotlight';
import ProgramInfo from '@components/sections/ProgramInfo';
import ChiefsCorner from '@components/sections/ChiefsCorner';
import InternsCorner from '@components/sections/InternsCorner';
// import ProgramDirector from '@components/sections/ProgramDirector';
import RecentSuccess from '@components/sections/RecentSuccess';
import Musings from '@components/sections/Musings';
import CommunityService from '@components/sections/CommunityService';
import PhotosOfTheMonth from '@components/sections/PhotosOfMonth';
import UpcomingEvents from '@components/sections/UpcomingEvents';
import BirthdaySection from '@components/sections/BirthdaySection';
import ThingsToDo from '@components/sections/ThingsToDo';
import NewsFromClinic from '@components/sections/NewsFromClinic';
// import WellnessCorner from '@components/sections/WellnessCorner';
import Podcast from '@/components/sections/Podcast';
import Culturosity from '@/components/sections/Culturosity';
import GenericSingleImageCarouselTextSection from '@/components/sections/GenericSingleImageCarouselTextSection';
import HalloweenCarousel from '@/components/sections/HalloweenCarousel';
// import BasicSection from '@/components/sections/BasicSection';

export default function Home() {
  const {
    banner,
    about,
    program,
    spotlight,
    genericSingleImageCarouselTextSection,
    basicSection,
    internsCorner,
    chiefsCorner,
    programDirector,
    recentSuccess,
    musings,
    communityServiceCorner,
    photosOfMonth,
    halloweenCarousel,
    events,
    thingsToDo,
    newsFromClinic,
    wellnessCorner,
    podcast,
    culturosity
  } = attributes;

  return (
    <Layout>
      <Head>
        <title>Azalea Report - SGMC Health IM Residency Newsletter</title>
        <meta property="og:title" content="Azalea Report" />
        <meta property="og:description" content="SGMC Health IM Residency Newsletter" />
        <meta property="og:image" content="https://azaleareport.com/img/og.jpeg" />
        <meta property="og:url" content="https://azaleareport.com" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Azalea Report" />
        <meta name="twitter:description" content="SGMC Health IM Residency Newsletter" />
        <meta name="twitter:image" content="https://azaleareport.com/img/og-twitter.jpeg" />

        <script defer data-domain="azaleareport.com" src="https://plausible.io/js/script.js"></script>
      </Head>
      <Banner banner={banner} />
      <SingleColumnLayout column={<AboutSection about={about} />} />
      <TwoColumnLayout
        leftColumn={<ResidentSpotlight spotlight={spotlight} />}
        rightColumn={<ProgramInfo program={program} />}
      />
      <SingleColumnLayout column={<ChiefsCorner chiefsCorner={chiefsCorner} />} />
      <SingleColumnLayout column={<RecentSuccess recentSuccess={recentSuccess} />} />
      <SingleColumnLayout column={<InternsCorner internsCorner={internsCorner} />} /> 
      <SingleColumnLayout column={<CommunityService communityServiceCorner={communityServiceCorner} />} />
      {halloweenCarousel && <SingleColumnLayout column={<HalloweenCarousel halloweenCarousel={halloweenCarousel} />} />}
      <SingleColumnLayout column={ <GenericSingleImageCarouselTextSection genericSingleImageCarouselTextSection={genericSingleImageCarouselTextSection} /> } />
      {/* <SingleColumnLayout column={<ProgramDirector programDirector={programDirector} />} /> */}

      {/* <SingleColumnLayout column={<BasicSection basicSection={basicSection} />} /> */}
      <SingleColumnLayout column={<Musings musings={musings} />} />  
      <SingleColumnLayout column={<Podcast podcast={podcast} />} />
      <SingleColumnLayout column={ <Culturosity culturosity={culturosity} /> } />
      <SingleColumnLayout column={<PhotosOfTheMonth photosOfMonth={photosOfMonth} />} />
      <TwoColumnLayout
        leftColumn={<UpcomingEvents events={events} />}
        rightColumn={<BirthdaySection birthdays={birthdays} />}
      />
      <SingleColumnLayout column={<ThingsToDo thingsToDo={thingsToDo} />} />
      <SingleColumnLayout column={<NewsFromClinic newsFromClinic={newsFromClinic} />} />
      {/* <SingleColumnLayout column={<WellnessCorner wellnessCorner={wellnessCorner} />} /> */}
    </Layout>
  );
}
