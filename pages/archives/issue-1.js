import { attributes } from '@content/issue-1.md';
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
import CommunityService from '@components/sections/CommunityService';
import PhotosOfTheMonth from '@components/sections/PhotosOfMonth';
import UpcomingEvents from '@components/sections/UpcomingEvents';
import BirthdaySection from '@components/sections/BirthdaySection';
import ThingsToDo from '@components/sections/ThingsToDo';
import NewsFromClinic from '@components/sections/NewsFromClinic';
import WellnessCorner from '@components/sections/WellnessCorner';

export default function Home() {
  const {
    banner,
    about,
    program,
    spotlight,
    chiefsCorner,
    programDirector,
    recentSuccess,
    communityServiceCorner,
    photosOfMonth,
    events,
    thingsToDo,
    newsFromClinic,
    wellnessCorner,
  } = attributes;

  return (
    <Layout>
      <Banner banner={banner} />
      <SingleColumnLayout column={<AboutSection about={about} />} />
      <TwoColumnLayout
        leftColumn={<ResidentSpotlight spotlight={spotlight} />}
        rightColumn={<ProgramInfo program={program} />}
      />
      <SingleColumnLayout column={<ChiefsCorner chiefsCorner={chiefsCorner} />} />
      <SingleColumnLayout column={<ProgramDirector programDirector={programDirector} />} />
      <SingleColumnLayout column={<RecentSuccess recentSuccess={recentSuccess} />} />
      <SingleColumnLayout column={<CommunityService communityServiceCorner={communityServiceCorner} />} />
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
