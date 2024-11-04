import styles from '@styles/UpcomingEvents.module.css';

const UpcomingEvents = ({ events: { sectionTitle, eventsList } }) => {
  return (
    <>
      <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
      <ul className={styles.eventList}>
        {eventsList.map((event, index) => (
          <li key={index} className={styles.eventItem}>
            <strong>{event.date} - </strong> {event.description}
          </li>
        ))}
      </ul>
    </>
  );
};

export default UpcomingEvents;
