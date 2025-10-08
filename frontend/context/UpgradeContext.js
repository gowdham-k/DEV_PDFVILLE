import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { API_BASE_URL } from '../components/config';

// Create the context
const UpgradeContext = createContext();

// Create a provider component
export function UpgradeProvider({ children }) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const router = useRouter();

  // Check if user is premium on mount
  useEffect(() => {
    const checkPremiumStatus = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/profile`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            // Extract custom:is_premium_ attribute
            const userIsPremium = userData.attributes && userData.attributes['custom:is_premium_'] === 'true';
            setIsPremium(userIsPremium);
          }
        } catch (error) {
          console.error("Premium status check failed:", error);
        }
      }
    };
    
    checkPremiumStatus();
  }, []);

  // Function to show the upgrade modal
  const showUpgradePrompt = (message) => {
    setUpgradeMessage(message || 'This feature requires a premium subscription');
    setShowUpgradeModal(true);
  };

  // Function to close the upgrade modal
  const closeUpgradeModal = () => {
    setShowUpgradeModal(false);
  };

  // Function to navigate to upgrade page
  const navigateToUpgrade = () => {
    router.push('/pricing');
    setShowUpgradeModal(false);
  };

  // Context value
  const value = {
    showUpgradeModal,
    upgradeMessage,
    isPremium,
    showUpgradePrompt,
    closeUpgradeModal,
    navigateToUpgrade
  };

  return (
    <UpgradeContext.Provider value={value}>
      {children}
    </UpgradeContext.Provider>
  );
}

// Custom hook to use the upgrade context
export function useUpgrade() {
  const context = useContext(UpgradeContext);
  if (context === undefined) {
    throw new Error('useUpgrade must be used within an UpgradeProvider');
  }
  return context;
}