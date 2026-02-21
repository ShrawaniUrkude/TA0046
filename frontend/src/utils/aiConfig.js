// Mock AI configuration and data for the AI Assistant

// Mock database of NGOs, hospitals, and schools
const mockData = {
  ngos: [
    {
      name: 'Hope Foundation',
      address: 'Andheri West, Mumbai, Maharashtra',
      phone: '+91 98765 43210',
      email: 'contact@hopefoundation.org',
      distance: '2.3 km',
      services: ['Education', 'Food Distribution', 'Healthcare']
    },
    {
      name: 'Care India',
      address: 'Bandra East, Mumbai, Maharashtra',
      phone: '+91 98765 43211',
      email: 'info@careindia.org',
      distance: '3.5 km',
      services: ['Child Welfare', 'Women Empowerment', 'Disaster Relief']
    },
    {
      name: 'Smile Foundation',
      address: 'Vashi, Navi Mumbai, Maharashtra',
      phone: '+91 98765 43212',
      email: 'contact@smilefoundation.org',
      distance: '5.1 km',
      services: ['Education', 'Healthcare', 'Livelihood']
    },
    {
      name: 'Akshaya Patra Foundation',
      address: 'Pune, Maharashtra',
      phone: '+91 98765 43213',
      email: 'info@akshayapatra.org',
      distance: '8.7 km',
      services: ['Mid-day Meals', 'Education Support']
    },
    {
      name: 'Goonj',
      address: 'Thane, Maharashtra',
      phone: '+91 98765 43214',
      email: 'contact@goonj.org',
      distance: '6.2 km',
      services: ['Clothing Distribution', 'Disaster Relief', 'Rural Development']
    }
  ],
  hospitals: [
    {
      name: 'Lilavati Hospital',
      address: 'Bandra West, Mumbai, Maharashtra',
      phone: '+91 22 2640 5000',
      email: 'info@lilavatihospital.com',
      distance: '1.8 km',
      services: ['Emergency Care', 'General Medicine', 'Surgery']
    },
    {
      name: 'Hinduja Hospital',
      address: 'Mahim, Mumbai, Maharashtra',
      phone: '+91 22 6741 5555',
      email: 'info@hindujahospital.com',
      distance: '4.2 km',
      services: ['Cardiology', 'Oncology', 'Orthopedics']
    },
    {
      name: 'Tata Memorial Hospital',
      address: 'Parel, Mumbai, Maharashtra',
      phone: '+91 22 2417 7000',
      email: 'info@tmc.gov.in',
      distance: '5.5 km',
      services: ['Cancer Treatment', 'Research', 'Palliative Care']
    },
    {
      name: 'KEM Hospital',
      address: 'Parel, Mumbai, Maharashtra',
      phone: '+91 22 2410 7000',
      email: 'info@kem.edu',
      distance: '5.8 km',
      services: ['Emergency Care', 'General Medicine', 'Trauma Center']
    },
    {
      name: 'Ruby Hall Clinic',
      address: 'Pune, Maharashtra',
      phone: '+91 20 6645 8888',
      email: 'info@rubyhall.com',
      distance: '12.3 km',
      services: ['Multi-specialty', 'Emergency Care', 'Advanced Surgery']
    }
  ],
  schools: [
    {
      name: 'Municipal School - Dharavi',
      address: 'Dharavi, Mumbai, Maharashtra',
      phone: '+91 22 2402 3456',
      email: 'dharavi.school@bmc.gov.in',
      distance: '3.1 km',
      services: ['Primary Education', 'Mid-day Meals', 'Free Education']
    },
    {
      name: 'Government High School',
      address: 'Kurla East, Mumbai, Maharashtra',
      phone: '+91 22 2508 7654',
      email: 'kurla.school@gov.in',
      distance: '4.5 km',
      services: ['Secondary Education', 'Sports Facilities', 'Computer Lab']
    },
    {
      name: 'Zilla Parishad School',
      address: 'Thane, Maharashtra',
      phone: '+91 22 2534 8765',
      email: 'thane.zp@education.gov.in',
      distance: '7.8 km',
      services: ['Primary & Secondary Education', 'Library', 'Scholarships']
    },
    {
      name: 'Ashram School',
      address: 'Palghar, Maharashtra',
      phone: '+91 2525 254321',
      email: 'palghar.ashram@gov.in',
      distance: '15.2 km',
      services: ['Residential Education', 'Tribal Welfare', 'Vocational Training']
    },
    {
      name: 'Municipal School - Worli',
      address: 'Worli, Mumbai, Maharashtra',
      phone: '+91 22 2493 2345',
      email: 'worli.school@bmc.gov.in',
      distance: '2.7 km',
      services: ['Primary Education', 'Computer Education', 'Sports']
    }
  ]
};

// AI response generator
export const generateAIResponse = (query) => {
  const lowerQuery = query.toLowerCase();

  // Donation-related queries
  if (lowerQuery.includes('donate') || lowerQuery.includes('donation')) {
    return 'To donate books:\n\n1. Visit the Donor Dashboard\n2. Fill in your details and verify your phone with OTP\n3. Enter book details (title, author, quantity, condition)\n4. Provide pickup address\n5. Submit and track your donation in real-time!\n\nA volunteer will be assigned to pick up your donation and deliver it to verified recipients.';
  }

  // Volunteer-related queries
  if (lowerQuery.includes('volunteer')) {
    return 'To become a volunteer:\n\n1. Go to the Volunteer Dashboard\n2. Register with your details and verify your phone\n3. Browse available donation tasks\n4. Accept a task and pick up from donor\n5. Select a verified needy recipient\n6. Deliver and confirm with OTP verification\n\nYou\'ll need a vehicle (bike, car, van, or bicycle) to transport donations!';
  }

  // OTP verification queries
  if (lowerQuery.includes('otp')) {
    return 'OTP (One-Time Password) verification ensures security:\n\n• Donors verify their phone before submitting donations\n• Volunteers verify their identity during registration\n• Recipients confirm delivery with OTP\n\nThis creates a transparent, trustworthy system where every action is verified. For demo purposes, you can use any 6-digit code!';
  }

  // Tracking queries
  if (lowerQuery.includes('track')) {
    return 'Track your donation in real-time:\n\n1. After submitting a donation, you\'ll see a tracking interface\n2. View the 5-step progress: Submitted → Assigned → Picked Up → In Transit → Delivered\n3. See live location of your donation on an interactive map\n4. View volunteer details and contact information\n5. See complete location history and timeline\n\nYou can also track from the Organization Dashboard!';
  }

  // Platform features
  if (lowerQuery.includes('how') && (lowerQuery.includes('work') || lowerQuery.includes('careconnect'))) {
    return 'CareConnect bridges donors, volunteers, and beneficiaries:\n\n🎯 Donors: Submit book donations with pickup details\n🚴 Volunteers: Accept tasks and deliver to verified recipients\n🏢 Organizations: Monitor all donations and volunteer activities\n🤖 AI Assistant: Find nearby NGOs, hospitals, schools\n\nKey features:\n✓ OTP verification for security\n✓ Real-time GPS tracking\n✓ Transparent donation history\n✓ Live location updates\n✓ Impact monitoring';
  }

  // Default response
  return 'I can help you with:\n\n• How to donate books\n• Becoming a volunteer\n• Tracking donations\n• OTP verification\n• Finding nearby NGOs, hospitals, schools\n• Understanding CareConnect features\n\nYou can also use the search tool on the right to find organizations near you! What would you like to know more about?';
};

// Search nearby places
export const searchNearbyPlaces = (location, type) => {
  const data = mockData[type] || [];
  
  // In a real app, this would filter based on actual location
  // For demo, we return all results with adjusted distances
  return data.map(item => ({
    ...item,
    distance: `${(Math.random() * 15 + 1).toFixed(1)} km`
  }));
};

export default {
  generateAIResponse,
  searchNearbyPlaces,
  mockData
};
