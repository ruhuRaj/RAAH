const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Department = require('./models/Department');
const Grievance = require('./models/Grievance');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample departments data
const departmentsData = [
  {
    name: 'Public Works Department',
    description: 'Handles road construction, maintenance, and public infrastructure'
  },
  {
    name: 'Health Department',
    description: 'Manages healthcare facilities, sanitation, and public health services'
  },
  {
    name: 'Education Department',
    description: 'Oversees schools, colleges, and educational institutions'
  },
  {
    name: 'Water Supply Department',
    description: 'Manages water distribution, sewage, and water quality'
  },
  {
    name: 'Electricity Department',
    description: 'Handles power distribution, maintenance, and electrical services'
  },
  {
    name: 'Transport Department',
    description: 'Manages public transportation, traffic, and road safety'
  },
  {
    name: 'Agriculture Department',
    description: 'Oversees farming, irrigation, and agricultural development'
  },
  {
    name: 'Municipal Corporation',
    description: 'Handles local governance, waste management, and civic amenities'
  }
];

// Sample users data
const usersData = [
  // Citizens
  {
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul.sharma@example.com',
    password: 'password123',
    accountType: 'Citizen',
    additionalDetails: {
      gender: 'Male',
      dateOfBirth: new Date('1990-05-15'),
      contactNumber: '+91-9876543210',
      address: '123 Main Street, City Center, District'
    }
  },
  {
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@example.com',
    password: 'password123',
    accountType: 'Citizen',
    additionalDetails: {
      gender: 'Female',
      dateOfBirth: new Date('1988-12-20'),
      contactNumber: '+91-9876543211',
      address: '456 Park Avenue, Residential Area, District'
    }
  },
  {
    firstName: 'Amit',
    lastName: 'Kumar',
    email: 'amit.kumar@example.com',
    password: 'password123',
    accountType: 'Citizen',
    additionalDetails: {
      gender: 'Male',
      dateOfBirth: new Date('1995-08-10'),
      contactNumber: '+91-9876543212',
      address: '789 Lake Road, Suburban Area, District'
    }
  },
  {
    firstName: 'Neha',
    lastName: 'Singh',
    email: 'neha.singh@example.com',
    password: 'password123',
    accountType: 'Citizen',
    additionalDetails: {
      gender: 'Female',
      dateOfBirth: new Date('1992-03-25'),
      contactNumber: '+91-9876543213',
      address: '321 Garden Street, Downtown, District'
    }
  },
  {
    firstName: 'Vikram',
    lastName: 'Verma',
    email: 'vikram.verma@example.com',
    password: 'password123',
    accountType: 'Citizen',
    additionalDetails: {
      gender: 'Male',
      dateOfBirth: new Date('1985-11-05'),
      contactNumber: '+91-9876543214',
      address: '654 Hill View, Uptown, District'
    }
  },

  // Nodal Officers
  {
    firstName: 'Dr. Rajesh',
    lastName: 'Gupta',
    email: 'rajesh.gupta@health.gov.in',
    password: 'password123',
    accountType: 'Nodal Officers',
    additionalDetails: {
      gender: 'Male',
      dateOfBirth: new Date('1975-06-15'),
      contactNumber: '+91-9876543220',
      address: 'Government Quarters, Health Complex, District',
      officerId: 'NO001'
    }
  },
  {
    firstName: 'Er. Meera',
    lastName: 'Reddy',
    email: 'meera.reddy@works.gov.in',
    password: 'password123',
    accountType: 'Nodal Officers',
    additionalDetails: {
      gender: 'Female',
      dateOfBirth: new Date('1980-09-22'),
      contactNumber: '+91-9876543221',
      address: 'Government Quarters, PWD Complex, District',
      officerId: 'NO002'
    }
  },
  {
    firstName: 'Prof. Suresh',
    lastName: 'Iyer',
    email: 'suresh.iyer@education.gov.in',
    password: 'password123',
    accountType: 'Nodal Officers',
    additionalDetails: {
      gender: 'Male',
      dateOfBirth: new Date('1978-04-12'),
      contactNumber: '+91-9876543222',
      address: 'Government Quarters, Education Complex, District',
      officerId: 'NO003'
    }
  },
  {
    firstName: 'Er. Kavita',
    lastName: 'Joshi',
    email: 'kavita.joshi@water.gov.in',
    password: 'password123',
    accountType: 'Nodal Officers',
    additionalDetails: {
      gender: 'Female',
      dateOfBirth: new Date('1982-07-30'),
      contactNumber: '+91-9876543223',
      address: 'Government Quarters, Water Complex, District',
      officerId: 'NO004'
    }
  },
  {
    firstName: 'Er. Deepak',
    lastName: 'Malhotra',
    email: 'deepak.malhotra@electricity.gov.in',
    password: 'password123',
    accountType: 'Nodal Officers',
    additionalDetails: {
      gender: 'Male',
      dateOfBirth: new Date('1977-12-08'),
      contactNumber: '+91-9876543224',
      address: 'Government Quarters, Electricity Complex, District',
      officerId: 'NO005'
    }
  },
  {
    firstName: 'Er. Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.kumar@transport.gov.in',
    password: 'password123',
    accountType: 'Nodal Officers',
    additionalDetails: {
      gender: 'Male',
      dateOfBirth: new Date('1981-03-18'),
      contactNumber: '+91-9876543225',
      address: 'Government Quarters, Transport Complex, District',
      officerId: 'NO006'
    }
  },
  {
    firstName: 'Ms. Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@municipal.gov.in',
    password: 'password123',
    accountType: 'Nodal Officers',
    additionalDetails: {
      gender: 'Female',
      dateOfBirth: new Date('1983-08-25'),
      contactNumber: '+91-9876543226',
      address: 'Government Quarters, Municipal Complex, District',
      officerId: 'NO007'
    }
  },

  // District Magistrate
  {
    firstName: 'Shri. Arun',
    lastName: 'Kumar',
    email: 'dm.district@gov.in',
    password: 'password123',
    accountType: 'District Magistrate',
    additionalDetails: {
      gender: 'Male',
      dateOfBirth: new Date('1970-01-15'),
      contactNumber: '+91-9876543300',
      address: 'DM Residence, Government Complex, District',
      officerId: 'DM001'
    }
  }
];

// Sample grievances data
const grievancesData = [
  {
    title: 'Broken Street Light on Main Road',
    description: 'The street light near the bus stand on Main Road has been broken for the past 3 days. This area becomes very dark at night and poses a safety risk for pedestrians and commuters.',
    category: 'Infrastructure',
    subCategory: 'Street Lighting',
    severity: 'Medium',
    priority: 'Medium',
    status: 'Submitted'
  },
  {
    title: 'Water Supply Issue in Residential Area',
    description: 'No water supply in Sector 5 residential area for the past week. Residents are facing severe water shortage and have to rely on water tankers.',
    category: 'Water Supply',
    subCategory: 'Water Distribution',
    severity: 'High',
    priority: 'High',
    status: 'Under Review'
  },
  {
    title: 'Potholes on Highway',
    description: 'Multiple large potholes on the main highway near the city entrance. These are causing traffic jams and vehicle damage. Immediate repair needed.',
    category: 'Roads',
    subCategory: 'Road Maintenance',
    severity: 'High',
    priority: 'High',
    status: 'Submitted'
  },
  {
    title: 'Garbage Collection Problem',
    description: 'Garbage is not being collected regularly in Ward 3. The area is becoming unhygienic and there is a risk of health issues.',
    category: 'Sanitation',
    subCategory: 'Waste Management',
    severity: 'Medium',
    priority: 'Medium',
    status: 'Submitted'
  },
  {
    title: 'School Building Repairs Needed',
    description: 'The government school building in Village Panchayat needs urgent repairs. The roof is leaking and walls have cracks.',
    category: 'Education',
    subCategory: 'Infrastructure',
    severity: 'High',
    priority: 'High',
    status: 'Under Review'
  },
  {
    title: 'Electricity Outage',
    description: 'Frequent power cuts in Industrial Area affecting business operations. The issue has been ongoing for 2 weeks.',
    category: 'Electricity',
    subCategory: 'Power Supply',
    severity: 'Critical',
    priority: 'Critical',
    status: 'Submitted'
  },
  {
    title: 'Public Park Maintenance',
    description: 'The children\'s park in City Center needs maintenance. Equipment is broken and the area is not clean.',
    category: 'Recreation',
    subCategory: 'Public Spaces',
    severity: 'Low',
    priority: 'Low',
    status: 'Submitted'
  },
  {
    title: 'Traffic Signal Malfunction',
    description: 'The traffic signal at the main intersection is not working properly, causing traffic chaos during peak hours.',
    category: 'Traffic',
    subCategory: 'Traffic Management',
    severity: 'High',
    priority: 'High',
    status: 'Under Review'
  },
  {
    title: 'Hospital Equipment Issue',
    description: 'The X-ray machine at the district hospital is not functioning properly. Patients are being referred to private hospitals.',
    category: 'Healthcare',
    subCategory: 'Medical Equipment',
    severity: 'High',
    priority: 'High',
    status: 'Submitted'
  },
  {
    title: 'Bus Stop Shelter Damaged',
    description: 'The bus stop shelter near the market is damaged and provides no protection from rain or sun.',
    category: 'Transport',
    subCategory: 'Public Transport',
    severity: 'Medium',
    priority: 'Medium',
    status: 'Submitted'
  }
];

// Seeder function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await User.deleteMany({});
    await Department.deleteMany({});
    await Grievance.deleteMany({});

    // Create departments
    console.log('🏢 Creating departments...');
    const departments = await Department.insertMany(departmentsData);
    console.log(`✅ Created ${departments.length} departments`);

    // Create users
    console.log('👥 Creating users...');
    const users = [];
    
    for (const userData of usersData) {
      // Assign department to nodal officers
      let departmentId = null;
      if (userData.accountType === 'Nodal Officers') {
        const email = userData.email;
        if (email.includes('health')) {
          departmentId = departments.find(d => d.name.includes('Health'))._id;
        } else if (email.includes('works')) {
          departmentId = departments.find(d => d.name.includes('Public Works'))._id;
        } else if (email.includes('education')) {
          departmentId = departments.find(d => d.name.includes('Education'))._id;
        } else if (email.includes('water')) {
          departmentId = departments.find(d => d.name.includes('Water'))._id;
        } else if (email.includes('electricity')) {
          departmentId = departments.find(d => d.name.includes('Electricity'))._id;
        } else if (email.includes('transport')) {
          departmentId = departments.find(d => d.name.includes('Transport'))._id;
        } else if (email.includes('municipal')) {
          departmentId = departments.find(d => d.name.includes('Municipal'))._id;
        }
      }

      const user = await User.create({
        ...userData,
        department: departmentId
      });
      users.push(user);
    }
    console.log(`✅ Created ${users.length} users`);

    // Create grievances
    console.log('📝 Creating grievances...');
    const citizens = users.filter(u => u.accountType === 'Citizen');
    const grievances = [];

    for (let i = 0; i < grievancesData.length; i++) {
      const grievanceData = grievancesData[i];
      const citizen = citizens[i % citizens.length];
      
      // Map grievance category to appropriate department
      let department = null;
      switch (grievanceData.category) {
        case 'Infrastructure':
        case 'Roads':
          department = departments.find(d => d.name.includes('Public Works'));
          break;
        case 'Healthcare':
        case 'Sanitation':
          department = departments.find(d => d.name.includes('Health'));
          break;
        case 'Education':
          department = departments.find(d => d.name.includes('Education'));
          break;
        case 'Water Supply':
          department = departments.find(d => d.name.includes('Water'));
          break;
        case 'Electricity':
          department = departments.find(d => d.name.includes('Electricity'));
          break;
        case 'Transport':
        case 'Traffic':
          department = departments.find(d => d.name.includes('Transport'));
          break;
        case 'Recreation':
        case 'Public Spaces':
          department = departments.find(d => d.name.includes('Municipal'));
          break;
        default:
          // Default to Municipal Corporation for unmatched categories
          department = departments.find(d => d.name.includes('Municipal'));
      }

      // Assign some grievances to nodal officers
      let assignedTo = null;
      let assignedBy = null;
      let status = grievanceData.status;

      if (i < 3) {
        // First 3 grievances are assigned
        const nodalOfficers = users.filter(u => u.accountType === 'Nodal Officers');
        const dm = users.find(u => u.accountType === 'District Magistrate');
        
        assignedTo = nodalOfficers[i % nodalOfficers.length]._id;
        assignedBy = dm._id;
        status = 'Assigned';
      }

      const grievance = await Grievance.create({
        ...grievanceData,
        user: citizen._id,
        department: department._id,
        assignedTo,
        assignedBy,
        status,
        location: {
          type: 'Point',
          addressText: `Sample location ${i + 1}, District`
        }
      });

      grievances.push(grievance);
    }
    console.log(`✅ Created ${grievances.length} grievances`);

    // Add some comments to grievances
    console.log('💬 Adding comments to grievances...');
    const dm = users.find(u => u.accountType === 'District Magistrate');
    const nodalOfficers = users.filter(u => u.accountType === 'Nodal Officers');

    for (let i = 0; i < 3; i++) {
      const grievance = grievances[i];
      if (grievance.assignedTo) {
        // Add DM assignment comment
        grievance.comments.push({
          user: dm._id,
          text: `Assigned to department for immediate attention. Priority: ${grievance.priority}`,
          isPublic: false
        });

        // Add nodal officer status update
        const nodalOfficer = nodalOfficers.find(no => no._id.toString() === grievance.assignedTo.toString());
        if (nodalOfficer) {
          grievance.comments.push({
            user: nodalOfficer._id,
            text: 'Status Update: Under Review - Investigating the issue and will provide update soon.',
            isPublic: true
          });
        }

        await grievance.save();
      }
    }

    console.log('✅ Added comments to grievances');

    // Display summary
    console.log('\n📊 Seeding Summary:');
    console.log(`🏢 Departments: ${departments.length}`);
    console.log(`👥 Users: ${users.length}`);
    console.log(`📝 Grievances: ${grievances.length}`);
    
    console.log('\n👤 User Accounts Created:');
    console.log('Citizens:');
    citizens.forEach(c => console.log(`  - ${c.firstName} ${c.lastName} (${c.email})`));
    
    console.log('\nNodal Officers:');
    const officers = users.filter(u => u.accountType === 'Nodal Officers');
    officers.forEach(o => console.log(`  - ${o.firstName} ${o.lastName} (${o.email})`));
    
    console.log('\nDistrict Magistrate:');
    console.log(`  - ${dm.firstName} ${dm.lastName} (${dm.email})`);

    console.log('\n🔑 Login Credentials:');
    console.log('All users have password: password123');
    console.log('\n🎯 Test Scenarios:');
    console.log('1. Login as Citizen and submit new grievances');
    console.log('2. Login as DM and assign grievances to departments');
    console.log('3. Login as Nodal Officer and update grievance status');
    console.log('4. Check dashboard analytics for each user type');
    console.log('5. Test email notifications (if configured)');

    console.log('\n✅ Database seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;