import { useEffect } from 'react';

const HUBSPOT_PORTAL_ID = '243665895';

/**
 * HubspotTracking component for adding HubSpot tracking and chat to pages
 * @param {Object} props - Component props
 * @param {string} props.pageName - Name of the current page for tracking
 * @param {Object} props.pageData - Additional data to track with the page view
 * @param {boolean} props.enableChat - Whether to enable the HubSpot chat widget
 */
// Removed direct script injection to avoid runtime errors caused by nested <script> tags in dangerouslySetInnerHTML
// HubSpot scripts are already included in _document.js; this component now only handles page view tracking when available.
const HubspotTracking = ({ pageName, pageData = {}, enableChat = true }) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.hubspot) {
      try {
        window.hubspot.track(pageName || 'Page Viewed', pageData);
      } catch (e) {
        // Silently ignore tracking errors
      }
    }
  }, [pageName, pageData]);

  // No additional scripts injected here to prevent conflicts
  return null;
};

export default HubspotTracking;
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