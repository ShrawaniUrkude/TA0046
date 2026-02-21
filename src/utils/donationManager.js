// Donation management utilities for localStorage operations

// Get all donations
export const getAllDonations = () => {
  try {
    const donations = localStorage.getItem('donations');
    return donations ? JSON.parse(donations) : [];
  } catch (error) {
    console.error('Error loading donations:', error);
    return [];
  }
};

// Get donation by ID
export const getDonationById = (id) => {
  const donations = getAllDonations();
  return donations.find(d => d.id === id);
};

// Add new donation
export const addDonation = (donation) => {
  try {
    const donations = getAllDonations();
    const newDonation = {
      ...donation,
      id: donation.id || `DON${Date.now()}`,
      timestamp: donation.timestamp || new Date().toISOString(),
      status: donation.status || 'pending'
    };
    donations.push(newDonation);
    localStorage.setItem('donations', JSON.stringify(donations));
    return newDonation;
  } catch (error) {
    console.error('Error adding donation:', error);
    return null;
  }
};

// Update donation
export const updateDonation = (id, updates) => {
  try {
    const donations = getAllDonations();
    const index = donations.findIndex(d => d.id === id);
    
    if (index === -1) {
      console.error('Donation not found:', id);
      return null;
    }
    
    donations[index] = {
      ...donations[index],
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('donations', JSON.stringify(donations));
    return donations[index];
  } catch (error) {
    console.error('Error updating donation:', error);
    return null;
  }
};

// Delete donation
export const deleteDonation = (id) => {
  try {
    const donations = getAllDonations();
    const filtered = donations.filter(d => d.id !== id);
    localStorage.setItem('donations', JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting donation:', error);
    return false;
  }
};

// Get donations by status
export const getDonationsByStatus = (status) => {
  const donations = getAllDonations();
  return donations.filter(d => d.status === status);
};

// Get donations by volunteer
export const getDonationsByVolunteer = (volunteerId) => {
  const donations = getAllDonations();
  return donations.filter(d => d.volunteer?.id === volunteerId);
};

// Update donation status
export const updateDonationStatus = (id, status, additionalData = {}) => {
  const statusTimestamps = {
    'pending': 'timestamp',
    'in-progress': 'acceptedAt',
    'picked-up': 'pickedUpAt',
    'in-transit': 'inTransitAt',
    'delivered': 'deliveredAt'
  };
  
  const timestampField = statusTimestamps[status];
  const updates = {
    status,
    ...additionalData
  };
  
  if (timestampField && !additionalData[timestampField]) {
    updates[timestampField] = new Date().toISOString();
  }
  
  return updateDonation(id, updates);
};

// Assign volunteer to donation
export const assignVolunteer = (donationId, volunteer) => {
  return updateDonation(donationId, {
    volunteer,
    status: 'in-progress',
    acceptedAt: new Date().toISOString()
  });
};

// Add location update to donation
export const addLocationUpdate = (donationId, location) => {
  const donation = getDonationById(donationId);
  if (!donation) return null;
  
  const locationHistory = donation.locationHistory || [];
  locationHistory.push({
    ...location,
    timestamp: new Date().toISOString()
  });
  
  return updateDonation(donationId, {
    currentLocation: location,
    locationHistory
  });
};

// Get completed deliveries
export const getCompletedDeliveries = () => {
  try {
    const deliveries = localStorage.getItem('completedDeliveries');
    return deliveries ? JSON.parse(deliveries) : [];
  } catch (error) {
    console.error('Error loading completed deliveries:', error);
    return [];
  }
};

// Add completed delivery
export const addCompletedDelivery = (donation) => {
  try {
    const deliveries = getCompletedDeliveries();
    deliveries.push({
      ...donation,
      completedAt: new Date().toISOString()
    });
    localStorage.setItem('completedDeliveries', JSON.stringify(deliveries));
    return true;
  } catch (error) {
    console.error('Error adding completed delivery:', error);
    return false;
  }
};

// Get statistics
export const getStatistics = () => {
  const donations = getAllDonations();
  const completed = getCompletedDeliveries();
  
  return {
    total: donations.length,
    pending: donations.filter(d => d.status === 'pending').length,
    inProgress: donations.filter(d => d.status === 'in-progress').length,
    pickedUp: donations.filter(d => d.status === 'picked-up').length,
    inTransit: donations.filter(d => d.status === 'in-transit').length,
    delivered: donations.filter(d => d.status === 'delivered').length,
    totalCompleted: completed.length,
    totalBooks: donations.reduce((sum, d) => sum + (parseInt(d.quantity) || 0), 0),
    activeVolunteers: [...new Set(donations.filter(d => d.volunteer).map(d => d.volunteer.id))].length
  };
};

// Clear all data (for testing/development)
export const clearAllData = () => {
  try {
    localStorage.removeItem('donations');
    localStorage.removeItem('completedDeliveries');
    localStorage.removeItem('currentVolunteer');
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

// Export current volunteer
export const getCurrentVolunteer = () => {
  try {
    const volunteer = localStorage.getItem('currentVolunteer');
    return volunteer ? JSON.parse(volunteer) : null;
  } catch (error) {
    console.error('Error loading current volunteer:', error);
    return null;
  }
};

// Set current volunteer
export const setCurrentVolunteer = (volunteer) => {
  try {
    localStorage.setItem('currentVolunteer', JSON.stringify(volunteer));
    return true;
  } catch (error) {
    console.error('Error setting current volunteer:', error);
    return false;
  }
};

export default {
  getAllDonations,
  getDonationById,
  addDonation,
  updateDonation,
  deleteDonation,
  getDonationsByStatus,
  getDonationsByVolunteer,
  updateDonationStatus,
  assignVolunteer,
  addLocationUpdate,
  getCompletedDeliveries,
  addCompletedDelivery,
  getStatistics,
  clearAllData,
  getCurrentVolunteer,
  setCurrentVolunteer
};
