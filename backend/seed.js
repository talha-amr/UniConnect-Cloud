const { sequelize, Student, Staff, Admin, Complaint, Category, CategoryName } = require('./models');
require('dotenv').config();
const bcrypt = require('bcryptjs'); // Assuming bcryptjs is installed as per package.json

const seedDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        // Sync and clear existing data (force: true clears everything)
        await sequelize.sync({ force: true });
        console.log('Database synced & cleared...');

        // Helper to hash password removed as hooks handle it
        const passwordPlain = '123456';

        // Create Admins for Two Universities
        await Admin.create({
            Name: 'Admin PUCIT',
            Email: 'admin@pucit.edu.pk',
            Password: passwordPlain
        });

        await Admin.create({
            Name: 'Admin LUMS',
            Email: 'admin@lums.edu.pk',
            Password: passwordPlain
        });

        // Create Staff (Matched to Domain)
        // --- PUCIT STAFF ---
        const staff1 = await Staff.create({
            Name: 'Staff IT PUCIT',
            Email: 'staff.it@pucit.edu.pk',
            Password: passwordPlain,
            Department: 'IT'
        });
        await Staff.create({
            Name: 'Staff Admin PUCIT',
            Email: 'staff.admin@pucit.edu.pk',
            Password: passwordPlain,
            Department: 'Administration'
        });

        // --- LUMS STAFF ---
        const staff2 = await Staff.create({
            Name: 'Staff Maint LUMS',
            Email: 'staff.maint@lums.edu.pk',
            Password: passwordPlain,
            Department: 'Maintenance'
        });
        await Staff.create({
            Name: 'Staff IT LUMS',
            Email: 'staff.it@lums.edu.pk',
            Password: passwordPlain,
            Department: 'IT'
        });

        // Create Students (Matched to Domain)
        // --- PUCIT STUDENTS ---
        const student1 = await Student.create({
            Name: 'Ali PUCIT',
            Email: 'ali@pucit.edu.pk',
            Password: passwordPlain,
            Department: 'CS'
        });
        await Student.create({
            Name: 'Osman PUCIT',
            Email: 'osman@pucit.edu.pk',
            Password: passwordPlain,
            Department: 'IT'
        });
        await Student.create({
            Name: 'Zara PUCIT',
            Email: 'zara@pucit.edu.pk',
            Password: passwordPlain,
            Department: 'CS'
        });

        // --- LUMS STUDENTS ---
        const student2 = await Student.create({
            Name: 'Ayesha LUMS',
            Email: 'ayesha@lums.edu.pk',
            Password: passwordPlain,
            Department: 'EE'
        });
        await Student.create({
            Name: 'Bilal LUMS',
            Email: 'bilal@lums.edu.pk',
            Password: passwordPlain,
            Department: 'Business'
        });
        await Student.create({
            Name: 'Fatima LUMS',
            Email: 'fatima@lums.edu.pk',
            Password: passwordPlain,
            Department: 'Law'
        });

        console.log('Users created...');

        // Create Categories and CategoryNames
        const categories = ['Academic', 'Infrastructure', 'Hostel', 'Transport', 'Administration', 'IT', 'Maintenance'];
        const categoryMap = {}; // Name -> ID

        for (const catName of categories) {
            const cat = await Category.create({});
            await CategoryName.create({
                Category_ID: cat.Category_ID,
                Category_name: catName
            });
            categoryMap[catName] = cat.Category_ID;
            console.log(`Created Category: ${catName}`);
        }

        // Create Complaints
        await Complaint.create({
            Title: 'WiFi Issues in Hostel A',
            Description: 'The wifi connection is dropping every 5 minutes.',
            Status: 'Pending',
            Is_anonymous: false,
            Student_ID: student1.Student_ID,
            Category_ID: categoryMap['IT']
        });

        await Complaint.create({
            Title: 'Broken Chair in Lab 3',
            Description: 'Seat back is broken.',
            Status: 'Resolved',
            Is_anonymous: true,
            Student_ID: student2.Student_ID,
            Category_ID: categoryMap['Maintenance']
        });

        // Add a resolved complaint for John to verify "Complaints Solved" stat
        await Complaint.create({
            Title: 'Projector not working',
            Description: 'Room 101 projector is dim.',
            Status: 'Resolved',
            Is_anonymous: false,
            Student_ID: student1.Student_ID,
            Category_ID: categoryMap['IT']
        });

        console.log('Complaints seeded...');
        console.log('Seeding Complete! Login with john@student.com / 123456');
        process.exit();

    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();
