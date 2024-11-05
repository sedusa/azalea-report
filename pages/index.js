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
import ProgramDirector from '@components/sections/ProgramDirector';
import RecentSuccess from '@components/sections/RecentSuccess';
import Musings from '@components/sections/Musings';
import CommunityService from '@components/sections/CommunityService';
import PhotosOfTheMonth from '@components/sections/PhotosOfMonth';
import UpcomingEvents from '@components/sections/UpcomingEvents';
import BirthdaySection from '@components/sections/BirthdaySection';
import ThingsToDo from '@components/sections/ThingsToDo';
import NewsFromClinic from '@components/sections/NewsFromClinic';
import WellnessCorner from '@components/sections/WellnessCorner';
import Podcast from '@/components/sections/Podcast';
import Culturosity from '@/components/sections/Culturosity';

export default function Home() {
  const {
    banner,
    about,
    program,
    spotlight,
    chiefsCorner,
    programDirector,
    recentSuccess,
    musings,
    communityServiceCorner,
    photosOfMonth,
    events,
    thingsToDo,
    newsFromClinic,
    wellnessCorner,
    podcast,
    culturosity
  } = attributes;

  return (
    <Layout>
      <Banner banner={banner} />
      <SingleColumnLayout column={<AboutSection about={about} />} />
      <TwoColumnLayout
        leftColumn={<ResidentSpotlight spotlight={spotlight} />}
        rightColumn={<ProgramInfo program={program} />}
      />
      <SingleColumnLayout column={<ProgramDirector programDirector={programDirector} />} />
      <SingleColumnLayout column={<ChiefsCorner chiefsCorner={chiefsCorner} />} />
      <SingleColumnLayout column={<Musings musings={musings} />} />
      <SingleColumnLayout column={ <Culturosity culturosity={culturosity} /> } />
      <SingleColumnLayout column={<RecentSuccess recentSuccess={recentSuccess} />} />
      <SingleColumnLayout column={<CommunityService communityServiceCorner={communityServiceCorner} />} />
      <SingleColumnLayout column={<Podcast podcast={podcast} />} />
      <SingleColumnLayout column={<PhotosOfTheMonth photosOfMonth={photosOfMonth} />} />
      <TwoColumnLayout
        leftColumn={<UpcomingEvents events={events} />}
        rightColumn={<BirthdaySection birthdays={birthdays} />}
      />
      <SingleColumnLayout column={<ThingsToDo thingsToDo={thingsToDo} />} />
      <SingleColumnLayout column={<NewsFromClinic newsFromClinic={newsFromClinic} />} />
      <SingleColumnLayout column={<WellnessCorner wellnessCorner={wellnessCorner} />} />
    </Layout>
  );
}
