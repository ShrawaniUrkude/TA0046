// Donation Storage Utility - Handles sharing donations between Donor and Volunteer dashboards

const DONATIONS_KEY = 'careconnect_donations';

// Get all donations
export const getAllDonations = () => {
  try {
    const donations = localStorage.getItem(DONATIONS_KEY);
    return donations ? JSON.parse(donations) : [];
  } catch (error) {
    console.error('Error reading donations:', error);
    return [];
  }
};

// Get available donations (pending, not yet accepted by volunteer)
export const getAvailableDonations = () => {
  const donations = getAllDonations();
  return donations.filter(d => d.volunteerStatus === 'pending');
};

// Get accepted donations for a volunteer
export const getAcceptedDonations = () => {
  const donations = getAllDonations();
  return donations.filter(d => d.volunteerStatus === 'accepted' || d.volunteerStatus === 'in-progress');
};

// Get declined donations
export const getDeclinedDonations = () => {
  const donations = getAllDonations();
  return donations.filter(d => d.volunteerStatus === 'declined');
};

// Get donations by donor
export const getDonorDonations = () => {
  const donations = getAllDonations();
  return donations;
};

// Save a new donation
export const saveDonation = (donation) => {
  try {
    const donations = getAllDonations();
    const newDonation = {
      ...donation,
      id: donation.id || `DON${Date.now()}`,
      volunteerStatus: 'pending', // pending, accepted, declined, completed
      deliveryStatus: 'waiting', // waiting, picked, in-transit, delivered
      createdAt: donation.createdAt || new Date().toISOString(),
    };
    donations.push(newDonation);
    localStorage.setItem(DONATIONS_KEY, JSON.stringify(donations));
    return newDonation;
  } catch (error) {
    console.error('Error saving donation:', error);
    return null;
  }
};

// Update donation status (for volunteer actions)
export const updateDonationStatus = (donationId, updates) => {
  try {
    const donations = getAllDonations();
    const index = donations.findIndex(d => d.id === donationId);
    if (index !== -1) {
      donations[index] = { ...donations[index], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(DONATIONS_KEY, JSON.stringify(donations));
      return donations[index];
    }
    return null;
  } catch (error) {
    console.error('Error updating donation:', error);
    return null;
  }
};

// Accept a donation (volunteer)
export const acceptDonation = (donationId, volunteerId, volunteerName) => {
  return updateDonationStatus(donationId, {
    volunteerStatus: 'accepted',
    deliveryStatus: 'assigned',
    volunteerId,
    volunteerName,
    acceptedAt: new Date().toISOString()
  });
};

// Decline a donation (volunteer)
export const declineDonation = (donationId, reason = '') => {
  return updateDonationStatus(donationId, {
    volunteerStatus: 'declined',
    declineReason: reason,
    declinedAt: new Date().toISOString()
  });
};

// Update delivery status
export const updateDeliveryStatus = (donationId, status) => {
  return updateDonationStatus(donationId, {
    deliveryStatus: status
  });
};

// Complete a delivery
export const completeDelivery = (donationId) => {
  return updateDonationStatus(donationId, {
    volunteerStatus: 'completed',
    deliveryStatus: 'delivered',
    completedAt: new Date().toISOString()
  });
};

export default {
  getAllDonations,
  getAvailableDonations,
  getAcceptedDonations,
  getDeclinedDonations,
  getDonorDonations,
  saveDonation,
  updateDonationStatus,
  acceptDonation,
  declineDonation,
  updateDeliveryStatus,
  completeDelivery
};
