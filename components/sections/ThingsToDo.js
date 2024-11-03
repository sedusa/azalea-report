import Carousel from '../Carousel';
import styles from '../../styles/ThingsToDo.module.css';

const ThingsToDo = ({ thingsToDo: { sectionTitle, images, items } }) => {
  return (
    <>
      <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
      <Carousel
        images={images.map((image) => ({ image }))}
        interval={8000}
        showCaption={false}
        showArrows={false}
      />
      <ul className={styles.thingsToDoList}>
        {items.map((item, index) => (
          <li key={index} className={styles.thingsToDoItem}>
            <h3 className={styles.thingsToDoTitle}>{item.title}</h3>
            <p className={styles.thingsToDoDate}>{item.date}</p>
            <p className={styles.thingsToDoDescription}>{item.description}</p>
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
    </>
  );
};

export default ThingsToDo;
