# CareConnect - Donation Management Platform

A full-stack donation management platform connecting donors, volunteers, and organizations to streamline charitable giving and distribution.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen)
![Leaflet](https://img.shields.io/badge/Maps-Leaflet-orange)

## 🌟 Features

### For Donors
- **Donation Categories** with urgency badges (Emergency, Critical, High Demand)
- **Multi-step Donation Form** for creating donation requests
- **Real-time Status Tracking** of donations
- **Beneficiary Information** - See who your donations help
- **Impact Stories** - View feedback from beneficiaries

### For Volunteers
- **Available Donations Tab** - View pending donation requests
- **Accept/Decline Functionality** - Manage pickup tasks
- **Interactive Leaflet Map** - View donor location with route visualization
- **Task Status Management** - Update pickup and delivery status
- **Navigation Assistance** - Get directions and estimated times

### For Organizations
- **Organization Profile** - Manage verification and contact info
- **Needs Management** - Post donation requests with urgency levels
- **Donation Tracker** - Monitor incoming donations
- **Volunteer Panel** - Track active volunteers
- **Inventory Management** - Track received and distributed items
- **AI Analysis** - Predictive demand insights
- **Feedback System** - Send thank you messages to donors
- **Notifications** - Real-time updates on donations

### AI Assistant
- **OpenAI Integration** - Smart chatbot for donation queries
- **Contextual Help** - Get assistance with platform features

## 🛠️ Tech Stack

### Frontend
- **React** 18.2.0
- **React-Leaflet** - Interactive maps
- **Leaflet** - Map rendering
- **Axios** - HTTP client
- **OpenAI** - AI chatbot integration
- **CSS3** - Custom styling (no frameworks)

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** - Authentication
- **Bcrypt.js** - Password hashing
- **Multer** - File uploads
- **Express-Validator** - Input validation
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
TA0046/
├── frontend/
│   ├── public/
│   │   └── images/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── LeafletMap.js
│   │   │   └── DonationTracker.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── DonorDashboard.js
│   │   │   ├── VolunteerDashboard.js
│   │   │   ├── OrganizationDashboard.js
│   │   │   └── AIAssistant.js
│   │   ├── utils/
│   │   │   └── donationStorage.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── donationController.js
│   │   ├── organizationController.js
│   │   └── volunteerController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Donation.js
│   │   └── Organization.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── donations.js
│   │   ├── organizations.js
│   │   └── volunteers.js
│   ├── uploads/
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── src/
    ├── pages/
    │   ├── DonorDashboard.js
    │   └── VolunteerDashboard.js
    ├── components/
    │   └── VolunteerRouteMap.js
    └── utils/
        └── donationStorage.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ShrawaniUrkude/TA0046.git
cd TA0046
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

3. **Install Backend Dependencies**
```bash
cd ../backend
npm install
```

4. **Configure Environment Variables**

Create a `.env` file in the `backend/` folder:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/careconnect
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Running the Application

1. **Start the Backend Server**
```bash
cd backend
npm run dev    # Development with nodemon
# or
npm start      # Production
```
Server runs at [http://localhost:5000](http://localhost:5000)

2. **Start the Frontend**
```bash
cd frontend
npm start
```
Application opens at [http://localhost:3000](http://localhost:3000)

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/logout` | Logout user |

### Donations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/donations` | Get all donations |
| GET | `/api/donations/my-donations` | Get user's donations |
| GET | `/api/donations/:id` | Get donation by ID |
| POST | `/api/donations` | Create donation |
| PUT | `/api/donations/:id` | Update donation |
| PUT | `/api/donations/:id/status` | Update status |
| DELETE | `/api/donations/:id` | Delete donation |

### Organizations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/organizations` | Get all organizations |
| GET | `/api/organizations/:id` | Get organization |
| POST | `/api/organizations` | Create organization |
| PUT | `/api/organizations/:id` | Update organization |
| PUT | `/api/organizations/:id/needs` | Update needs |

### Volunteers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/volunteers` | Get all volunteers |
| GET | `/api/volunteers/available-tasks` | Get available tasks |
| GET | `/api/volunteers/my-tasks` | Get assigned tasks |
| POST | `/api/volunteers/accept-task/:id` | Accept task |
| PUT | `/api/volunteers/complete-task/:id` | Complete task |

## 🔐 User Roles
- **Donor** - Create and track donations
- **Volunteer** - Accept and deliver donations
- **Organization** - Manage needs and receive donations
- **Admin** - Full system access

## 🗺️ Maps Integration
The platform uses **Leaflet** with **OpenStreetMap** for:
- Displaying donor pickup locations
- Showing delivery routes
- Interactive markers with popups
- Geocoding addresses via Nominatim API

## 📱 Screenshots

### Home Page
- Hero section with call-to-action
- Feature cards showcasing platform benefits
- Responsive design

### Donor Dashboard
- Category selection with urgency badges
- Multi-step donation form
- Status tracker

### Volunteer Dashboard
- Available donations list
- Accept/Decline actions
- Interactive map with route visualization

### Organization Dashboard
- 9 comprehensive sections
- AI-powered demand predictions
- Inventory management

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the ISC License.

## 👤 Author
**Shrawani Urkude**
- GitHub: [@ShrawaniUrkude](https://github.com/ShrawaniUrkude)

## 🙏 Acknowledgments
- OpenStreetMap for map tiles
- Leaflet for mapping library
- React community for excellent documentation
