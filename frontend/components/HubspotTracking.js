import Script from 'next/script';
import { useEffect } from 'react';

const HUBSPOT_PORTAL_ID = '243665895';

/**
 * HubspotTracking component for adding HubSpot tracking and chat to pages
 * @param {Object} props - Component props
 * @param {string} props.pageName - Name of the current page for tracking
 * @param {Object} props.pageData - Additional data to track with the page view
 * @param {boolean} props.enableChat - Whether to enable the HubSpot chat widget
 */
const HubspotTracking = ({ pageName, pageData = {}, enableChat = true }) => {
  // Track page view when component mounts
  useEffect(() => {
    if (window.hubspot) {
      window.hubspot.track(pageName || 'Page Viewed', pageData);
    }
  }, [pageName, pageData]);

  return (
    <>
      <Script
        id="hubspot-tracking"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(d,s,i,r) {
              if (d.getElementById(i)){return;}
              var n=d.createElement(s),e=d.getElementsByTagName(s)[0];
              n.id=i;n.src='//js.hs-scripts.com/${HUBSPOT_PORTAL_ID}.js';
              e.parentNode.insertBefore(n, e);
            })(document,"script","hs-script-loader");
          `
        }}
      />
      {enableChat && (
        <Script
          id="hubspot-chat"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.hsConversationsSettings = {
                loadImmediately: true,
                enableWidgetCookieBanner: true
              };
            `
          }}
        />
      )}
    </>
  );
};

/**
 * Track an event in HubSpot
 * @param {string} eventName - Name of the event to track
 * @param {Object} eventData - Additional data to track with the event
 */
export const trackEvent = (eventName, eventData = {}) => {
  if (typeof window !== 'undefined' && window.hubspot) {
    window.hubspot.track(eventName, eventData);
  }
};

export default HubspotTracking;