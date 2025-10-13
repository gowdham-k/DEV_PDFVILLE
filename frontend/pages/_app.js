import Layout from '../components/layout';
import '../styles/global.css';
import { Amplify } from "aws-amplify";   
import awsConfig from "../awsConfig";
import HubspotTracking from '../components/HubspotTracking';
import { UpgradeProvider } from '../context/UpgradeContext';
import UpgradeModal from '../components/UpgradeModal';
import { useEffect } from 'react';
import Router from 'next/router';

Amplify.configure(awsConfig);

export default function MyApp({ Component, pageProps }) {
  // Ensure every navigation scrolls to top once the route change completes
  useEffect(() => {
    const handleScrollTop = () => {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    };
    Router.events.on('routeChangeComplete', handleScrollTop);
    Router.events.on('hashChangeComplete', handleScrollTop);
    return () => {
      Router.events.off('routeChangeComplete', handleScrollTop);
      Router.events.off('hashChangeComplete', handleScrollTop);
    };
  }, []);

  return (
    <UpgradeProvider>
      <Layout>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, margin=0, padding=0"></meta>
        <Component {...pageProps} />
        <HubspotTracking pageName="App" enableChat={true} />
        <UpgradeModalContainer />
      </Layout>
    </UpgradeProvider>
  );
}

// Separate component to conditionally render the upgrade modal
function UpgradeModalContainer() {
  // We need to use dynamic import with no SSR to avoid hydration issues
  // since the modal uses browser-only features
  const { showUpgradeModal } = require('../context/UpgradeContext').useUpgrade();
  
  return showUpgradeModal ? <UpgradeModal /> : null;
}