import React, { useState, useEffect } from 'react';
import './DonorDashboard.css';
import { saveDonation, getAllDonations, getAvailableDonations, getAcceptedDonations } from '../utils/donationStorage';

function DonorDashboard() {
  const [activeTab, setActiveTab] = useState('categories');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDonationForm, setShowDonationForm] = useState(false);
  
  // Donation form state
  const [formData, setFormData] = useState({
    category: '',
    itemType: '',
    quantity: '',
    pickupLocation: '',
    pickupTime: '',
    pickupDate: '',
  });

  // Sample data for demonstration
  const [donations, setDonations] = useState([]);
  const [activeDonation, setActiveDonation] = useState(null);

  // Load donations from shared storage on mount
  useEffect(() => {
    const storedDonations = getAllDonations();
    setDonations(storedDonations);
    // Set the most recent active donation
    const active = storedDonations.find(d => d.deliveryStatus !== 'delivered');
    if (active) setActiveDonation(active);
  }, []);

  // Donation Categories with urgency levels
  const categories = [
    { id: 'food', icon: '🍚', name: 'Food', description: 'Dry food, cooked meals, groceries', items: ['Rice', 'Dal', 'Vegetables', 'Cooked Meals', 'Biscuits', 'Bread'], urgency: 'critical', urgencyLabel: '🚨 Critical Need' },
    { id: 'clothes', icon: '👕', name: 'Clothes', description: 'New / usable clothes', items: ['Shirts', 'Pants', 'Sarees', 'Kids Wear', 'Winter Wear', 'Shoes'], urgency: 'medium', urgencyLabel: '⚠️ High Demand' },
    { id: 'education', icon: '📚', name: 'Education', description: 'Books, stationery, bags', items: ['Textbooks', 'Notebooks', 'Pens/Pencils', 'School Bags', 'Geometry Box', 'Calculator'], urgency: 'low', urgencyLabel: 'Regular' },
    { id: 'medical', icon: '🩺', name: 'Medical Supplies', description: 'First aid, medicines', items: ['First Aid Kit', 'Bandages', 'OTC Medicines', 'Masks', 'Sanitizers', 'Thermometer'], urgency: 'emergency', urgencyLabel: '🆘 EMERGENCY' },
    { id: 'children', icon: '🧸', name: 'Children Essentials', description: 'Toys, hygiene kits', items: ['Toys', 'Baby Food', 'Diapers', 'Baby Clothes', 'Hygiene Kit', 'Feeding Bottles'], urgency: 'critical', urgencyLabel: '🚨 Critical Need' },
    { id: 'daily', icon: '🏠', name: 'Daily Essentials', description: 'Blankets, utensils', items: ['Blankets', 'Utensils', 'Mattress', 'Pillow', 'Bucket', 'Water Bottles'], urgency: 'medium', urgencyLabel: '⚠️ High Demand' },
  ];

  // Sample beneficiary data
  const beneficiaries = [
    { id: 1, type: 'Children', location: 'Mumbai, Maharashtra', need: 'Educational supplies for underprivileged children', verified: true, icon: '👧' },
    { id: 2, type: 'Elderly', location: 'Delhi, NCR', need: 'Daily essentials and medical supplies', verified: true, icon: '👴' },
    { id: 3, type: 'Shelter Home', location: 'Bangalore, Karnataka', need: 'Clothes and blankets for winter', verified: true, icon: '🏠' },
    { id: 4, type: 'Orphanage', location: 'Chennai, Tamil Nadu', need: 'Food supplies and children essentials', verified: true, icon: '🏛️' },
  ];

  // Sample volunteer data
  const assignedVolunteer = {
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    rating: 4.8,
    pickupsCompleted: 156,
    status: 'assigned',
    avatar: '👨‍💼'
  };

  // Sample impact data
  const impactData = [
    { id: 1, image: '📸', message: 'Thank you for the books! The children loved them.', tag: 'Helped 15 children', date: '2026-02-15' },
    { id: 2, image: '📸', message: 'The blankets kept us warm during winter nights.', tag: 'Helped 8 elderly', date: '2026-02-10' },
    { id: 3, image: '📸', message: 'Food supplies lasted us an entire week!', tag: 'Fed 25 people', date: '2026-02-05' },
  ];

  // Status tracker steps
  const statusSteps = [
    { id: 1, label: 'Donation Registered', icon: '📝' },
    { id: 2, label: 'Volunteer Assigned', icon: '🙋' },
    { id: 3, label: 'Pickup Completed', icon: '🚗' },
    { id: 4, label: 'Delivered to Beneficiary', icon: '🎁' },
  ];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setFormData(prev => ({ ...prev, category: category.id, itemType: '' }));
    setShowDonationForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitDonation = (e) => {
    e.preventDefault();
    
    const newDonation = {
      id: `DON${Date.now()}`,
      ...formData,
      categoryName: selectedCategory?.name,
      categoryIcon: selectedCategory?.icon,
      status: 'registered',
      currentStep: 1,
      timestamp: new Date().toISOString(),
      donorName: 'Current Donor', // In real app, get from auth
      donorPhone: '+91 98765 00000',
      pickupCoords: { lat: 19.0760, lng: 72.8777 }, // Default Mumbai coords
      deliveryLocation: beneficiaries[Math.floor(Math.random() * beneficiaries.length)]?.location || 'Local Charity',
      deliveryCoords: { lat: 19.0420, lng: 72.8561 },
      estimatedDistance: `${(Math.random() * 15 + 5).toFixed(1)} km`,
      estimatedTime: `${Math.floor(Math.random() * 30 + 15)} mins`,
      beneficiary: beneficiaries[Math.floor(Math.random() * beneficiaries.length)]
    };

    // Save to shared storage for volunteer access
    const savedDonation = saveDonation(newDonation);
    
    const updatedDonations = [...donations, savedDonation];
    setDonations(updatedDonations);
    setActiveDonation(savedDonation);
    
    // Reset form
    setFormData({
      category: '',
      itemType: '',
      quantity: '',
      pickupLocation: '',
      pickupTime: '',
      pickupDate: '',
    });
    setSelectedCategory(null);
    setShowDonationForm(false);
    setActiveTab('tracker');
    
    alert('Donation request submitted successfully! A volunteer will pick it up soon.');
  };

  const getCurrentStep = (donation) => {
    if (!donation) return 0;
    switch(donation.status) {
      case 'registered': return 1;
      case 'assigned': return 2;
      case 'picked': return 3;
      case 'delivered': return 4;
      default: return 1;
    }
  };

  const renderCategories = () => (
    <div className="categories-section">
      <h2 className="section-title">What would you like to donate?</h2>
      <p className="section-subtitle">Select a category to begin your donation</p>
      <div className="categories-grid">
        {categories.map(category => (
          <div 
            key={category.id} 
            className={`category-card ${selectedCategory?.id === category.id ? 'selected' : ''} ${category.urgency === 'emergency' || category.urgency === 'critical' ? 'urgent' : ''}`}
            onClick={() => handleCategorySelect(category)}
          >
            {(category.urgency === 'emergency' || category.urgency === 'critical') && (
              <div className={`urgency-badge ${category.urgency}`}>
                {category.urgencyLabel}
              </div>
            )}
            {category.urgency === 'medium' && (
              <div className="urgency-badge medium">
                {category.urgencyLabel}
              </div>
            )}
            <span className="category-icon">{category.icon}</span>
            <h3>{category.name}</h3>
            <p>{category.description}</p>
          </div>
        ))}
      </div>

      {showDonationForm && selectedCategory && (
        <div className="donation-form-modal">
          <div className="donation-form-container">
            <div className="form-header">
              <h2>{selectedCategory.icon} Create Donation Request</h2>
              <button className="close-btn" onClick={() => { setShowDonationForm(false); setSelectedCategory(null); }}>×</button>
            </div>
            <form onSubmit={handleSubmitDonation}>
              <div className="form-group">
                <label>Category</label>
                <input type="text" value={`${selectedCategory.icon} ${selectedCategory.name}`} disabled />
              </div>
              
              <div className="form-group">
                <label>Select Item Type *</label>
                <select 
                  name="itemType" 
                  value={formData.itemType} 
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Choose an item...</option>
                  {selectedCategory.items.map(item => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Quantity (units) *</label>
                <input 
                  type="number" 
                  name="quantity" 
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="Enter quantity"
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Pickup Location *</label>
                <input 
                  type="text" 
                  name="pickupLocation" 
                  value={formData.pickupLocation}
                  onChange={handleInputChange}
                  placeholder="Enter your full address"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Preferred Pickup Date *</label>
                  <input 
                    type="date" 
                    name="pickupDate" 
                    value={formData.pickupDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Preferred Pickup Time *</label>
                  <select 
                    name="pickupTime" 
                    value={formData.pickupTime}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select time slot...</option>
                    <option value="9am-12pm">9:00 AM - 12:00 PM</option>
                    <option value="12pm-3pm">12:00 PM - 3:00 PM</option>
                    <option value="3pm-6pm">3:00 PM - 6:00 PM</option>
                    <option value="6pm-9pm">6:00 PM - 9:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => { setShowDonationForm(false); setSelectedCategory(null); }}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Submit Donation Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderTracker = () => (
    <div className="tracker-section">
      <h2 className="section-title">Donation Status Tracker</h2>
      {activeDonation ? (
        <div className="tracker-container">
          <div className="donation-info-bar">
            <span className="donation-id">ID: {activeDonation.id}</span>
            <span className="donation-item">{activeDonation.categoryIcon} {activeDonation.itemType} × {activeDonation.quantity}</span>
          </div>
          <div className="status-steps">
            {statusSteps.map((step, index) => (
              <div 
                key={step.id} 
                className={`status-step ${getCurrentStep(activeDonation) >= step.id ? 'completed' : ''} ${getCurrentStep(activeDonation) === step.id ? 'current' : ''}`}
              >
                <div className="step-icon">{step.icon}</div>
                <div className="step-label">{step.label}</div>
                {index < statusSteps.length - 1 && <div className="step-connector"></div>}
              </div>
            ))}
          </div>
          <div className="tracker-note">
            <p>📌 Your donation is being processed. You will be notified at each step.</p>
          </div>
        </div>
      ) : (
        <div className="no-donation">
          <p>No active donations. Start by creating a donation request!</p>
          <button className="start-btn" onClick={() => setActiveTab('categories')}>
            Create Donation
          </button>
        </div>
      )}
    </div>
  );

  const renderBeneficiaries = () => (
    <div className="beneficiaries-section">
      <h2 className="section-title">Beneficiary Details</h2>
      <p className="section-subtitle">Your donations help these verified beneficiaries</p>
      <div className="beneficiaries-grid">
        {beneficiaries.map(beneficiary => (
          <div key={beneficiary.id} className="beneficiary-card">
            <div className="beneficiary-header">
              <span className="beneficiary-icon">{beneficiary.icon}</span>
              <div className="beneficiary-type">
                <h3>{beneficiary.type}</h3>
                {beneficiary.verified && <span className="verified-badge">✓ Verified</span>}
              </div>
            </div>
            <div className="beneficiary-details">
              <p className="location">📍 {beneficiary.location}</p>
              <p className="need">{beneficiary.need}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="beneficiary-note">
        <p>📌 All beneficiaries are verified by our team to ensure donations reach genuine needy people.</p>
      </div>
    </div>
  );

  const renderVolunteerPanel = () => (
    <div className="volunteer-section">
      <h2 className="section-title">Volunteer Coordination Panel</h2>
      {activeDonation ? (
        <div className="volunteer-container">
          <div className="volunteer-card">
            <div className="volunteer-avatar">{assignedVolunteer.avatar}</div>
            <div className="volunteer-info">
              <h3>{assignedVolunteer.name}</h3>
              <p className="volunteer-rating">⭐ {assignedVolunteer.rating} ({assignedVolunteer.pickupsCompleted} pickups)</p>
            </div>
            <div className="volunteer-status">
              <span className={`status-badge ${assignedVolunteer.status}`}>
                {assignedVolunteer.status === 'assigned' ? '✓ Assigned' : 'Pending'}
              </span>
            </div>
          </div>
          <div className="volunteer-actions">
            <button className="action-btn chat">
              💬 Chat with Volunteer
            </button>
            <button className="action-btn call">
              📞 Call Volunteer
            </button>
          </div>
          <div className="pickup-status">
            <h4>Pickup Confirmation Status</h4>
            <div className="confirmation-steps">
              <div className="conf-step completed">✓ Volunteer Notified</div>
              <div className="conf-step completed">✓ Pickup Accepted</div>
              <div className="conf-step pending">⏳ En Route to Pickup</div>
              <div className="conf-step pending">○ Pickup Completed</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-volunteer">
          <p>No volunteer assigned yet. Create a donation request to get matched with a volunteer.</p>
        </div>
      )}
      <div className="volunteer-note">
        <p>📌 Our volunteers help bridge the coordination gap between donors and beneficiaries.</p>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="history-section">
      <h2 className="section-title">Donation History</h2>
      <p className="section-subtitle">Track all your past donations</p>
      {donations.length > 0 ? (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {donations.map(donation => (
                <tr key={donation.id}>
                  <td>
                    <span className="cat-icon">{donation.categoryIcon}</span>
                    {donation.categoryName}
                  </td>
                  <td>{donation.itemType}</td>
                  <td>{donation.quantity} units</td>
                  <td>{new Date(donation.timestamp).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-pill ${donation.status}`}>
                      {donation.status === 'registered' && '📝 Registered'}
                      {donation.status === 'assigned' && '🙋 Assigned'}
                      {donation.status === 'picked' && '🚗 Picked Up'}
                      {donation.status === 'delivered' && '✅ Delivered'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-history">
          <p>No donation history yet. Your donations will appear here once you make them.</p>
        </div>
      )}
      <div className="history-note">
        <p>📌 Keep track of all your contributions without any monetary tracking - just pure item-based records.</p>
      </div>
    </div>
  );

  const renderImpact = () => (
    <div className="impact-section">
      <h2 className="section-title">Your Impact</h2>
      <p className="section-subtitle">See how your donations are making a difference</p>
      <div className="impact-stats">
        <div className="stat-card">
          <span className="stat-number">{donations.length}</span>
          <span className="stat-label">Total Donations</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{donations.reduce((sum, d) => sum + parseInt(d.quantity || 0), 0)}</span>
          <span className="stat-label">Items Donated</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">48</span>
          <span className="stat-label">Lives Touched</span>
        </div>
      </div>
      <div className="impact-stories">
        <h3>Thank You Messages</h3>
        {impactData.map(impact => (
          <div key={impact.id} className="impact-card">
            <div className="impact-image">{impact.image}</div>
            <div className="impact-content">
              <p className="impact-message">"{impact.message}"</p>
              <div className="impact-meta">
                <span className="impact-tag">🏷️ {impact.tag}</span>
                <span className="impact-date">{new Date(impact.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="impact-note">
        <p>📌 Every donation creates a ripple of positive change in someone's life!</p>
      </div>
    </div>
  );

  return (
    <div className="donor-dashboard">
      <div className="dashboard-header">
        <h1>🤝 Donor Dashboard</h1>
        <p>Make a meaningful difference in someone's life</p>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          📦 Donate
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tracker' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracker')}
        >
          📍 Track
        </button>
        <button 
          className={`tab-btn ${activeTab === 'beneficiaries' ? 'active' : ''}`}
          onClick={() => setActiveTab('beneficiaries')}
        >
          👥 Beneficiaries
        </button>
        <button 
          className={`tab-btn ${activeTab === 'volunteer' ? 'active' : ''}`}
          onClick={() => setActiveTab('volunteer')}
        >
          🙋 Volunteer
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📜 History
        </button>
        <button 
          className={`tab-btn ${activeTab === 'impact' ? 'active' : ''}`}
          onClick={() => setActiveTab('impact')}
        >
          💫 Impact
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'categories' && renderCategories()}
        {activeTab === 'tracker' && renderTracker()}
        {activeTab === 'beneficiaries' && renderBeneficiaries()}
        {activeTab === 'volunteer' && renderVolunteerPanel()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'impact' && renderImpact()}
      </div>
    </div>
  );
}

export default DonorDashboard;
