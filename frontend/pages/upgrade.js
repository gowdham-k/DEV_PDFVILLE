import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Upgrade() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { reason } = router.query;

  if (!router.isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  useEffect(() => {
    if (reason) {
      console.log(`Upgrade prompt shown: ${reason}`);
    }
  }, [reason]);

  const handleUpgradeClick = async () => {
    setIsLoading(true);
    console.log(`Upgrade button clicked: ${reason || 'general'}`);
    try {
      await router.push("/pricing");
    } catch (error) {
      console.error("Navigation error:", error);
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    console.log("Back button clicked from upgrade prompt");
    router.back();
  };

  const getReasonMessage = (reason) => {
    const messages = {
      'export': 'Export functionality requires Premium access to handle large datasets.',
      'analytics': 'Advanced analytics and reporting are available with Premium.',
      'api': 'API access and higher rate limits are included in Premium plans.',
      'storage': 'Additional storage space is available with Premium membership.',
      'collaboration': 'Team collaboration features require a Premium subscription.',
      'priority-support': 'Priority customer support is included with Premium plans.',
    };
    return messages[reason || ''] || reason || "This feature is only available for Premium users.";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-center px-4">
      <div className="animate-fade-in bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
          <svg 
            className="w-8 h-8 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 10V3L4 14h7v7l9-11h-7z" 
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Premium Required
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          {getReasonMessage(reason)}
        </p>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-8">
          <h3 className="font-semibold text-gray-800 mb-2">Premium includes:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center justify-center">
              <span className="text-green-500 mr-2">✓</span>
              Unlimited access to all features
            </div>
            <div className="flex items-center justify-center">
              <span className="text-green-500 mr-2">✓</span>
              Priority customer support
            </div>
            <div className="flex items-center justify-center">
              <span className="text-green-500 mr-2">✓</span>
              Advanced analytics & reporting
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleUpgradeClick}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Loading...
              </div>
            ) : (
              "Upgrade to Premium"
            )}
          </button>
          
          <button
            onClick={handleGoBack}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
          >
            Go Back
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Questions? Contact our{" "}
          <button 
            onClick={() => router.push("/support")}
            className="text-blue-600 hover:underline font-medium"
          >
            support team
          </button>
        </p>
      </div>
    </div>
  );
}
