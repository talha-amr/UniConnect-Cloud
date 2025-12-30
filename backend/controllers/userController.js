const { Student, Staff } = require('../models');

// @desc    Get all users (Students & Staff)
// @route   GET /api/users
// @access  Admin
const getAllUsers = async (req, res) => {
    try {
        // 1. Get Logged-in Admin's Domain
        const adminEmail = req.user.Email; // Assuming req.user is populated by auth middleware
        const adminDomain = adminEmail.substring(adminEmail.lastIndexOf("@"));

        // 2. Fetch Users matching that domain
        //    (Using Sequelize Op.like)
        const { Op } = require('sequelize');

        const students = await Student.findAll({
            where: {
                Email: { [Op.like]: `%${adminDomain}` }
            }
        });

        const staff = await Staff.findAll({
            where: {
                Email: { [Op.like]: `%${adminDomain}` }
            }
        });

        const formattedStudents = students.map(user => ({
            id: user.Student_ID,
            initial: user.Name ? user.Name.charAt(0).toUpperCase() : 'S',
            name: user.Name,
            email: user.Email,
            type: 'Student',
            createdDate: user.createdAt || user.created_at,
            status: 'active',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200'
        }));

        const formattedStaff = staff.map(user => ({
            id: user.Staff_ID,
            initial: user.Name ? user.Name.charAt(0).toUpperCase() : 'H',
            name: user.Name,
            email: user.Email,
            type: 'Staff',
            createdDate: user.createdAt || user.created_at,
            status: 'active',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        }));

        res.json([...formattedStudents, ...formattedStaff]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
    const { id } = req.params;
    const { type } = req.query; // 'Student' or 'Staff'

    try {
        let Model;

        if (type === 'Student') {
            Model = Student;
        } else if (type === 'Staff') {
            Model = Staff;
        } else {
            return res.status(400).json({ message: 'Invalid user type' });
        }

        const user = await Model.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAllUsers, deleteUser };
