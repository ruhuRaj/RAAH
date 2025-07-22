# RAAH (Redressal Application for Advanced Harmony)

A comprehensive district-level grievance management system built with the MERN stack, designed to provide transparency and efficient handling of citizen complaints.

## 🌟 Features

### 👥 Multi-Role System
- **Citizens**: Submit grievances, track status, receive notifications
- **Nodal Officers**: Handle assigned grievances, update status, communicate with citizens
- **District Magistrate (DM)**: Oversee all grievances, assign to departments, manage system

### 📊 Dashboard Analytics
- **Interactive Pie Charts**: Visual representation of grievance statistics
- **Real-time Statistics**: Live updates on grievance counts and status
- **Role-based Views**: Different analytics for each user type

### 🔔 Comprehensive Notifications
- **Email Notifications**: Automated emails for all status changes
- **Real-time Updates**: Instant notifications for grievance assignments and updates
- **Multi-party Communication**: Citizens, Nodal Officers, and DM stay informed

### 📱 Modern UI/UX
- **Responsive Design**: Works seamlessly on all devices
- **Beautiful Interface**: Modern, clean design with intuitive navigation
- **Interactive Elements**: Hover effects, loading states, and smooth transitions

### 🔐 Security Features
- **JWT Authentication**: Secure token-based authentication
- **OTP Verification**: Email verification during registration
- **Role-based Access Control**: Secure access based on user roles
- **Password Management**: Secure password reset and change functionality

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd raah-project
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

3. **Environment Setup**
   Create a `.env` file in the server directory:
   ```env
   # Database Configuration
   MONGODB_URL=mongodb://localhost:27017/raah_db
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   
   # Email Configuration (Gmail)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # Frontend URL
   YOUR_FRONTEND_URL=http://localhost:3000
   
   # Server Configuration
   PORT=4000
   NODE_ENV=development
   ```

4. **Start the application**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start separately
   npm start          # Frontend
   npm run server     # Backend
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

## 📋 User Guide

### For Citizens

1. **Registration & Login**
   - Sign up with email verification (OTP)
   - Login with email and password

2. **Dashboard Overview**
   - View personal grievance statistics
   - See total grievances submitted
   - Quick access to submit new grievances

3. **Submit Grievance**
   - Fill grievance details (title, description, category)
   - Upload attachments (images, videos, documents)
   - Select department and priority level

4. **Track Grievances**
   - View all submitted grievances
   - Check real-time status updates
   - Receive email notifications for updates

### For Nodal Officers

1. **Dashboard**
   - View assigned grievances statistics
   - See department-specific overview
   - Quick access to assigned grievances

2. **Manage Assigned Grievances**
   - View all grievances assigned to department
   - Update grievance status with notes
   - Communicate with citizens through status updates

3. **Status Management**
   - Update status: Under Review, In Progress, Resolved, Rejected, Reopened
   - Add detailed notes for each update
   - Automatic notifications to citizens and DM

### For District Magistrate (DM)

1. **Dashboard Overview**
   - View district-wide grievance statistics
   - Monitor overall system performance
   - Quick access to management functions

2. **Assign Grievances**
   - View all unassigned grievances
   - Assign grievances to appropriate departments
   - Add assignment notes for nodal officers

3. **Department Management**
   - Create and manage departments
   - Assign nodal officers to departments
   - Monitor department performance

4. **System Oversight**
   - View all grievances in the system
   - Monitor grievance progress
   - Manage user accounts and permissions

## 🛠️ Technical Stack

### Frontend
- **React.js**: Modern UI framework
- **Redux Toolkit**: State management
- **React Router**: Navigation
- **Tailwind CSS**: Styling
- **Recharts**: Data visualization
- **React Hot Toast**: Notifications

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM
- **JWT**: Authentication
- **Nodemailer**: Email service
- **Cloudinary**: File storage
- **Multer**: File upload handling

### Key Features
- **Real-time Updates**: Live status changes
- **File Upload**: Support for images, videos, documents
- **Email Notifications**: Automated communication
- **Responsive Design**: Mobile-first approach
- **Security**: JWT tokens, password hashing, input validation

## 📁 Project Structure

```
raah-project/
├── src/                    # Frontend source code
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   ├── store/             # Redux store
│   └── utils/             # Utility functions
├── server/                # Backend source code
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── utils/            # Utility functions
├── public/               # Static files
└── package.json          # Dependencies
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/send-otp` - Send OTP for verification
- `POST /api/auth/verify-otp` - Verify OTP

### Grievances
- `GET /api/grievances` - Get all grievances
- `POST /api/grievances` - Create new grievance
- `PUT /api/grievances/:id` - Update grievance
- `GET /api/grievances/stats/dashboard` - Get grievance statistics
- `GET /api/grievances/unassigned` - Get unassigned grievances (DM only)
- `GET /api/grievances/assigned` - Get assigned grievances (Nodal only)

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Interactive Charts**: Beautiful data visualization
- **Loading States**: Smooth user experience
- **Toast Notifications**: User-friendly feedback
- **Color-coded Status**: Easy status identification

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt encryption
- **Input Validation**: Server-side validation
- **CORS Protection**: Cross-origin security
- **Rate Limiting**: API protection
- **File Upload Security**: Secure file handling

## 📧 Email Notifications

The system sends automated emails for:
- New grievance submissions (to DM)
- Grievance assignments (to Nodal Officers)
- Status updates (to Citizens and DM)
- Password reset requests
- Account verification

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy the build folder to your hosting service
```

### Backend Deployment
```bash
# Set NODE_ENV=production
npm start
# Deploy to your server or cloud platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🎯 Future Enhancements

- **Real-time Chat**: Direct messaging between users
- **Mobile App**: Native mobile application
- **Advanced Analytics**: Detailed reporting and insights
- **Multi-language Support**: Internationalization
- **API Documentation**: Swagger/OpenAPI docs
- **Performance Optimization**: Caching and optimization

---

**RAAH** - Empowering citizens through transparent grievance management.