import Layout from '../components/layout';
import '../styles/global.css';
import { Amplify } from "aws-amplify";   
import awsConfig from "../awsConfig";
import HubspotTracking from '../components/HubspotTracking';

Amplify.configure(awsConfig);

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, margin=0, padding=0"></meta>
      <Component {...pageProps} />
      <HubspotTracking pageName="App" enableChat={true} />
    </Layout>
  );
}