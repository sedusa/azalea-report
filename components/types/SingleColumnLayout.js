import styles from '../../styles/SingleColumnLayout.module.css';

const SingleColumnLayout = ({ column }) => {
  return (
    <section className={styles.fullWidth}>
      {column}
    </section>
  );
};

export default SingleColumnLayout;