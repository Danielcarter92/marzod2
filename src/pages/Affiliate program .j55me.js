//```javascript
import React, { useState, useEffect } from 'react';
import { useAuthenticatedUser } from 'wix-auth';
import { useWixData } from "@wix/data-hooks";
import { useNavigate } from 'wix-router';

const AffiliateDashboard = () => {
  const navigate = useNavigate();
  const { userEmail } = useAuthenticatedUser();
  const { data, error, isLoading, isReady } = useWixData({
    key: 'Affiliate',
    query: `
      query Affiliate {
        affiliateInfo(where: { userId: "$userEmail" }) {
          inviteCode
          totalReferrals
          pendingRewards
          paidRewards
        }
      }
    `,
    variables: { userEmail },
  });

  useEffect(() => {
    if (!isReady || !data || !data.affiliateInfo || error) {
      return;
    }
    setAffiliateInfo(data.affiliateInfo);
  }, [isReady, data, error]);

  const [affiliateInfo, setAffiliateInfo] = useState(null);

  const handleGenerateInviteCode = async () => {
    try {
      await wixData.fetch('Affiliate', { userId: userEmail });
      const newCode = await generateInviteCode();
      setAffiliateInfo({ ...affiliateInfo, inviteCode: newCode });
    } catch (error) {
      console.error("Error generating invite code:", error);
      // Handle error UI
    }
  };

  const handleReferUser = async (referredUserEmail) => {
    try {
      await trackReferral(userEmail, referredUserEmail);
      // Update UI for successful referral
    } catch (error) {
      console.error("Error tracking referral:", error);
      // Handle error UI
    }
  };

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <h1>Welcome to the Affiliate Dashboard</h1>
          {affiliateInfo ? (
            <div>
              <h2>Your Invite Code: {affiliateInfo.inviteCode}</h2>
              <p>Total Referrals: {affiliateInfo.totalReferrals}</p>
              <p>Pending Rewards: ${affiliateInfo.pendingRewards}</p>
              <p>Paid Rewards: ${affiliateInfo.paidRewards}</p>
              <button onClick={() => handleGenerateInviteCode()}>
                Generate New Invite Code
              </button>
              <inviteLinkInput
          :="email"
                placeholder="Enter referred user email"
                onChange={(e) => handleGenerateInviteCode()}>
              /
              <button onClick={() => handleReferUser(affiliateInfo.email)}>
                Refer User
              </button>
         </div>
          ) : (
            <div>
              <p>No affiliate data found for your account.</p>
              <button onClick={() => navigate('/signup')}>Sign Up to Become an Affiliate</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AffiliateDashboard;
