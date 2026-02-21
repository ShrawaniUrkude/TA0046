import React, { useState, useEffect } from 'react';
import './DonorDashboard.css';

function DonorDashboard() {
  const [activeTab, setActiveTab] = useState('categories');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [formStep, setFormStep] = useState(1);
  
  // Donation form state
  const [formData, setFormData] = useState({
    category: '',
    itemType: '',
    quantity: '',
    condition: 'good',
    description: '',
    donorName: '',
    donorPhone: '',
    donorEmail: '',
    pickupLocation: '',
    pickupTime: '',
    pickupDate: '',
    additionalNotes: '',
    photoPreview: null,
  });

  // Sample data for demonstration
  const [donations, setDonations] = useState([]);
  const [activeDonation, setActiveDonation] = useState(null);

  // Load donations from localStorage on mount
  useEffect(() => {
    const storedDonations = JSON.parse(localStorage.getItem('donorDonations') || '[]');
    setDonations(storedDonations);
    // Set the most recent active donation
    const active = storedDonations.find(d => d.status !== 'delivered');
    if (active) setActiveDonation(active);
  }, []);

  // Donation Categories
  const categories = [
    { id: 'food', icon: '🍚', name: 'Food', description: 'Dry food, cooked meals, groceries', items: ['Rice', 'Dal', 'Vegetables', 'Cooked Meals', 'Biscuits', 'Bread'] },
    { id: 'clothes', icon: '👕', name: 'Clothes', description: 'New / usable clothes', items: ['Shirts', 'Pants', 'Sarees', 'Kids Wear', 'Winter Wear', 'Shoes'] },
    { id: 'education', icon: '📚', name: 'Education', description: 'Books, stationery, bags', items: ['Textbooks', 'Notebooks', 'Pens/Pencils', 'School Bags', 'Geometry Box', 'Calculator'] },
    { id: 'medical', icon: '🩺', name: 'Medical Supplies', description: 'First aid, medicines', items: ['First Aid Kit', 'Bandages', 'OTC Medicines', 'Masks', 'Sanitizers', 'Thermometer'] },
    { id: 'children', icon: '🧸', name: 'Children Essentials', description: 'Toys, hygiene kits', items: ['Toys', 'Baby Food', 'Diapers', 'Baby Clothes', 'Hygiene Kit', 'Feeding Bottles'] },
    { id: 'daily', icon: '🏠', name: 'Daily Essentials', description: 'Blankets, utensils', items: ['Blankets', 'Utensils', 'Mattress', 'Pillow', 'Bucket', 'Water Bottles'] },
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
      volunteer: assignedVolunteer,
      beneficiary: beneficiaries[Math.floor(Math.random() * beneficiaries.length)]
    };

    const updatedDonations = [...donations, newDonation];
    setDonations(updatedDonations);
    setActiveDonation(newDonation);
    localStorage.setItem('donorDonations', JSON.stringify(updatedDonations));
    
    // Reset form
    setFormData({
      category: '',
      itemType: '',
      quantity: '',
      condition: 'good',
      description: '',
      donorName: '',
      donorPhone: '',
      donorEmail: '',
      pickupLocation: '',
      pickupTime: '',
      pickupDate: '',
      additionalNotes: '',
      photoPreview: null,
    });
    setSelectedCategory(null);
    setShowDonationForm(false);
    setFormStep(1);
    setActiveTab('tracker');
    
    alert('Donation request submitted successfully!');
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
            className={`category-card ${selectedCategory?.id === category.id ? 'selected' : ''}`}
            onClick={() => handleCategorySelect(category)}
          >
            <span className="category-icon">{category.icon}</span>
            <h3>{category.name}</h3>
            <p>{category.description}</p>
          </div>
        ))}
      </div>

      {showDonationForm && selectedCategory && (
        <div className="donation-form-modal">
          <div className="donation-form-container enhanced">
            <div className="form-header">
              <div className="form-title-section">
                <h2>{selectedCategory.icon} Create Donation Request</h2>
                <p className="form-subtitle">Fill in the details to donate your items</p>
              </div>
              <button className="close-btn" onClick={() => { setShowDonationForm(false); setSelectedCategory(null); setFormStep(1); }}>×</button>
            </div>

            {/* Progress Steps */}
            <div className="form-progress">
              <div className={`progress-step ${formStep >= 1 ? 'active' : ''} ${formStep > 1 ? 'completed' : ''}`}>
                <div className="step-number">{formStep > 1 ? '✓' : '1'}</div>
                <span>Item Details</span>
              </div>
              <div className={`progress-step ${formStep >= 2 ? 'active' : ''} ${formStep > 2 ? 'completed' : ''}`}>
                <div className="step-number">{formStep > 2 ? '✓' : '2'}</div>
                <span>Your Info</span>
              </div>
              <div className={`progress-step ${formStep >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <span>Pickup</span>
              </div>
            </div>

            <form onSubmit={handleSubmitDonation}>
              {/* Step 1: Item Details */}
              {formStep === 1 && (
                <div className="form-step-content">
                  <h3 className="step-heading">📦 Item Details</h3>
                  
                  <div className="form-group">
                    <label>Category</label>
                    <div className="category-display">
                      <span className="category-icon-large">{selectedCategory.icon}</span>
                      <span>{selectedCategory.name}</span>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Select Item Type <span className="required">*</span></label>
                    <select 
                      name="itemType" 
                      value={formData.itemType} 
                      onChange={handleInputChange}
                      required
                      className="styled-select"
                    >
                      <option value="">Choose an item...</option>
                      {selectedCategory.items.map(item => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Quantity <span className="required">*</span></label>
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
                      <label>Condition <span className="required">*</span></label>
                      <select 
                        name="condition" 
                        value={formData.condition}
                        onChange={handleInputChange}
                        required
                        className="styled-select"
                      >
                        <option value="new">New (Unused)</option>
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Brief Description</label>
                    <textarea 
                      name="description" 
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your donation items (brand, size, color, etc.)"
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <label>Upload Photo (Optional)</label>
                    <div className="photo-upload-area">
                      {formData.photoPreview ? (
                        <div className="photo-preview">
                          <span>📸 Photo selected</span>
                          <button type="button" onClick={() => setFormData({...formData, photoPreview: null})}>Remove</button>
                        </div>
                      ) : (
                        <div className="upload-placeholder">
                          <span className="upload-icon">📷</span>
                          <p>Click to upload a photo of your donation</p>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => {
                              if (e.target.files[0]) {
                                setFormData({...formData, photoPreview: URL.createObjectURL(e.target.files[0])});
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={() => { setShowDonationForm(false); setSelectedCategory(null); setFormStep(1); }}>
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      className="next-btn"
                      onClick={() => {
                        if (formData.itemType && formData.quantity) {
                          setFormStep(2);
                        } else {
                          alert('Please fill in all required fields');
                        }
                      }}
                    >
                      Next Step →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Donor Information */}
              {formStep === 2 && (
                <div className="form-step-content">
                  <h3 className="step-heading">👤 Your Information</h3>

                  <div className="form-group">
                    <label>Full Name <span className="required">*</span></label>
                    <input 
                      type="text" 
                      name="donorName" 
                      value={formData.donorName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone Number <span className="required">*</span></label>
                      <input 
                        type="tel" 
                        name="donorPhone" 
                        value={formData.donorPhone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        name="donorEmail" 
                        value={formData.donorEmail}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="info-box">
                    <span className="info-icon">🔒</span>
                    <p>Your contact information will only be shared with the assigned volunteer for pickup coordination.</p>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="back-btn" onClick={() => setFormStep(1)}>
                      ← Back
                    </button>
                    <button 
                      type="button" 
                      className="next-btn"
                      onClick={() => {
                        if (formData.donorName && formData.donorPhone) {
                          setFormStep(3);
                        } else {
                          alert('Please fill in all required fields');
                        }
                      }}
                    >
                      Next Step →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Pickup Details */}
              {formStep === 3 && (
                <div className="form-step-content">
                  <h3 className="step-heading">📍 Pickup Details</h3>

                  <div className="form-group">
                    <label>Pickup Address <span className="required">*</span></label>
                    <textarea 
                      name="pickupLocation" 
                      value={formData.pickupLocation}
                      onChange={handleInputChange}
                      placeholder="Enter complete address with landmark"
                      rows="2"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Preferred Date <span className="required">*</span></label>
                      <input 
                        type="date" 
                        name="pickupDate" 
                        value={formData.pickupDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Preferred Time <span className="required">*</span></label>
                      <select 
                        name="pickupTime" 
                        value={formData.pickupTime}
                        onChange={handleInputChange}
                        required
                        className="styled-select"
                      >
                        <option value="">Select time slot...</option>
                        <option value="9am-12pm">🌅 9:00 AM - 12:00 PM</option>
                        <option value="12pm-3pm">☀️ 12:00 PM - 3:00 PM</option>
                        <option value="3pm-6pm">🌤️ 3:00 PM - 6:00 PM</option>
                        <option value="6pm-9pm">🌙 6:00 PM - 9:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Additional Instructions</label>
                    <textarea 
                      name="additionalNotes" 
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      placeholder="Any special instructions for the volunteer (gate code, parking info, etc.)"
                      rows="2"
                    />
                  </div>

                  {/* Donation Summary */}
                  <div className="donation-summary">
                    <h4>📋 Donation Summary</h4>
                    <div className="summary-grid">
                      <div className="summary-item">
                        <span className="summary-label">Category:</span>
                        <span className="summary-value">{selectedCategory.icon} {selectedCategory.name}</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Item:</span>
                        <span className="summary-value">{formData.itemType}</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Quantity:</span>
                        <span className="summary-value">{formData.quantity} units</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Condition:</span>
                        <span className="summary-value">{formData.condition}</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Donor:</span>
                        <span className="summary-value">{formData.donorName}</span>
                      </div>
                      <div className="summary-item">
                        <span className="summary-label">Phone:</span>
                        <span className="summary-value">{formData.donorPhone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="back-btn" onClick={() => setFormStep(2)}>
                      ← Back
                    </button>
                    <button type="submit" className="submit-btn">
                      ✓ Submit Donation Request
                    </button>
                  </div>
                </div>
              )}
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
