import User from '../../models/User.js';

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const search = req.query.search ? req.query.search.trim() : null;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Optionally filter by verification status
    if (req.query.isVerified === 'true') filter.isVerified = true;
    if (req.query.isVerified === 'false') filter.isVerified = false;

    const [users, total] = await Promise.all([
      User.find(filter).sort('-createdAt').skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
        next: skip + limit < total ? page + 1 : null,
        prev: page > 1 ? page - 1 : null,
      },
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// GET /api/admin/users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user by id:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// PATCH /api/admin/users/:id
export const updateUser = async (req, res) => {
  try {
    const updates = req.body || {};
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, data: user, message: 'User updated' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
