import { attributes } from '../content/home.md';
import { useState, useEffect } from 'react';
import Layout from '../app/Layout';
import Welcome from '../components/sections/Welcome';

export default function About() {
  const { welcome } = attributes;
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
      <Welcome welcome={welcome} />
    </Layout>
  );
}
