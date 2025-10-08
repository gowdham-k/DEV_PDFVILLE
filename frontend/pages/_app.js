import Layout from '../components/layout';
import '../styles/global.css';
import { Amplify } from "aws-amplify";   
import awsConfig from "../awsConfig";
import HubspotTracking from '../components/HubspotTracking';
import { UpgradeProvider } from '../context/UpgradeContext';
import UpgradeModal from '../components/UpgradeModal';

Amplify.configure(awsConfig);

export default function MyApp({ Component, pageProps }) {
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