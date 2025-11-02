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
    {
      date: 'November 2024',
      title: 'Issue 2',
      link: '/archives/issue-2'
    },
    {
      date: 'February 2025',
      title: 'Issue 3',
      link: '/archives/issue-3'
    },
    {
      date: 'July 2025',
      title: 'Issue 4',
      link: '/archives/issue-4'
    },
    {
      date: 'September 2025',
      title: 'Issue 5',
      link: '/archives/issue-5'
    }
  ];

  return (
    <Layout>
      <SingleColumnLayout
        column={
          <>
            <h2 className={styles.sectionTitle}>Newsletter Archives</h2>
            <hr className={styles.divider} />
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