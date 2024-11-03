import { useState, useEffect } from 'react';
import styles from '../../styles/BirthdaySection.module.css';

const BirthdaySection = ( {birthdays }) => {
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

export default BirthdaySection;