import Layout from '@app/Layout';
import SingleColumnLayout from '@components/types/SingleColumnLayout';
import styles from '@styles/Archives.module.css';

const Archives = () => {

  const archives = [
    {
      date: 'October 2024',
      title: 'Issue 1',
      link: '/archives/issue-1'
    },
  ];

  return (
    <Layout>
      <SingleColumnLayout
        column={
          <>
            <h2 className={styles.sectionTitle}>Newsletter Archives</h2>
            <ul className={styles.archivesList}>
              {archives.map((archive, index) => (
                <li key={index}>
                  <a 
                    href={archive.link}
                    className={styles.archiveLink}
                  >
                    <p className={styles.archiveTitle}>
                      {archive.title} - {archive.date}
                    </p>
                  </a>
                </li>
              ))}
            </ul>
          </>
        }
      />
    </Layout>
  );
} 

export default Archives;