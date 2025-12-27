// src/pages/users/UsersList.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaFilter, 
  FaUserPlus, 
  FaEdit, 
  FaTrash,
  FaEye,
  FaDownload,
  FaUserCircle,
  FaEnvelope,
  FaCalendar,
  FaCheckCircle,
  FaTimesCircle,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaKey,
  FaSync,
  FaBan,
  FaCheck
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UsersList = () => {
  // Mock data based on your User model
  const [users, setUsers] = useState([
    {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      isVerified: true,
      verificationCode: null,
      verificationAttempts: 0,
      createdAt: '2024-01-10T10:30:00Z',
      updatedAt: '2024-01-15T14:20:00Z'
    },
    {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      isVerified: false,
      verificationCode: '123456',
      verificationAttempts: 2,
      createdAt: '2024-01-12T09:15:00Z',
      updatedAt: '2024-01-15T11:45:00Z'
    },
    {
      _id: '3',
      name: 'Robert Johnson',
      email: 'robert@example.com',
      isVerified: true,
      verificationCode: null,
      verificationAttempts: 0,
      createdAt: '2024-01-05T14:20:00Z',
      updatedAt: '2024-01-14T16:30:00Z'
    },
    {
      _id: '4',
      name: 'Emily Davis',
      email: 'emily@example.com',
      isVerified: false,
      verificationCode: '789012',
      verificationAttempts: 3,
      createdAt: '2024-01-08T11:45:00Z',
      updatedAt: '2024-01-15T09:20:00Z'
    },
    {
      _id: '5',
      name: 'Michael Wilson',
      email: 'michael@example.com',
      isVerified: true,
      verificationCode: null,
      verificationAttempts: 1,
      createdAt: '2024-01-03T16:30:00Z',
      updatedAt: '2024-01-13T10:15:00Z'
    },
  ]);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'verified', 'unverified'
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        filterStatus === 'all' || 
        (filterStatus === 'verified' && user.isVerified) ||
        (filterStatus === 'unverified' && !user.isVerified);
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'createdAt' || sortField === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Handle user selection
  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user._id));
    }
  };

  // Handle user actions
  const handleVerifyUser = (userId) => {
    setUsers(prev => prev.map(user => 
      user._id === userId ? { ...user, isVerified: true, verificationCode: null } : user
    ));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user._id !== userId));
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleResendVerification = (userId) => {
    // Mock API call to resend verification
    setIsLoading(true);
    setTimeout(() => {
      setUsers(prev => prev.map(user => 
        user._id === userId 
          ? { 
              ...user, 
              verificationCode: Math.floor(100000 + Math.random() * 900000).toString(),
              verificationAttempts: user.verificationAttempts + 1
            } 
          : user
      ));
      setIsLoading(false);
      alert('Verification code sent to user email');
    }, 1000);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="text-gray-400" />;
    return sortDirection === 'asc' 
      ? <FaSortUp className="text-blue-500" /> 
      : <FaSortDown className="text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">User Management</h2>
            <p className="text-blue-100">Manage all users, verification status, and access</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="text-center">
              <p className="text-sm text-blue-100">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-100">Verified</p>
              <p className="text-2xl font-bold">{users.filter(u => u.isVerified).length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-100">Pending</p>
              <p className="text-2xl font-bold">{users.filter(u => !u.isVerified).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified Only</option>
              </select>
              <FaFilter className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {selectedUsers.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{selectedUsers.length} selected</span>
                <button 
                  onClick={() => {
                    // Bulk verify
                    setUsers(prev => prev.map(user => 
                      selectedUsers.includes(user._id) 
                        ? { ...user, isVerified: true, verificationCode: null }
                        : user
                    ));
                    setSelectedUsers([]);
                  }}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                >
                  Verify Selected
                </button>
                <button 
                  onClick={() => {
                    if (window.confirm(`Delete ${selectedUsers.length} users?`)) {
                      setUsers(prev => prev.filter(user => !selectedUsers.includes(user._id)));
                      setSelectedUsers([]);
                    }
                  }}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  Delete Selected
                </button>
              </div>
            )}
            
            <Link
              to="/users/create"
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaUserPlus />
              <span>Add User</span>
            </Link>
            
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <FaDownload />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>User</span>
                    {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Email</span>
                    {getSortIcon('email')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                  onClick={() => handleSort('isVerified')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {getSortIcon('isVerified')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                  onClick={() => handleSort('verificationAttempts')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Attempts</span>
                    {getSortIcon('verificationAttempts')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left text-gray-600 font-medium cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Joined</span>
                    {getSortIcon('createdAt')}
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                          <FaUserCircle className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.name || 'No Name'}</p>
                          <p className="text-sm text-gray-500">ID: {user._id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <FaEnvelope className="text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {user.isVerified ? (
                          <>
                            <FaCheckCircle className="text-green-500" />
                            <span className="text-green-700 font-medium">Verified</span>
                          </>
                        ) : (
                          <>
                            <FaTimesCircle className="text-yellow-500" />
                            <span className="text-yellow-700 font-medium">Unverified</span>
                            {user.verificationCode && (
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                Code: {user.verificationCode}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <FaKey className="text-gray-400" />
                        <span className={user.verificationAttempts > 2 ? 'text-red-600 font-medium' : ''}>
                          {user.verificationAttempts} attempt{user.verificationAttempts !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <FaCalendar className="text-gray-400" />
                        <span>{formatDate(user.createdAt)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleResendVerification(user._id)}
                          disabled={isLoading || user.isVerified}
                          className={`p-2 rounded ${user.isVerified 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                          title="Resend Verification"
                        >
                          <FaSync className={isLoading ? 'animate-spin' : ''} />
                        </button>
                        
                        {!user.isVerified && (
                          <button 
                            onClick={() => handleVerifyUser(user._id)}
                            className="p-2 rounded bg-green-100 text-green-600 hover:bg-green-200"
                            title="Verify User"
                          >
                            <FaCheck />
                          </button>
                        )}
                        
                        <Link
                          to={`/users/${user._id}/edit`}
                          className="p-2 rounded bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                          title="Edit User"
                        >
                          <FaEdit />
                        </Link>
                        
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 rounded bg-red-100 text-red-600 hover:bg-red-200"
                          title="Delete User"
                        >
                          <FaTrash />
                        </button>
                        
                        <Link
                          to={`/users/${user._id}`}
                          className="p-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                          title="View Details"
                        >
                          <FaEye />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FaUserCircle className="text-4xl text-gray-300" />
                      <p>No users found</p>
                      {searchTerm && (
                        <p className="text-sm">Try adjusting your search or filters</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {filteredUsers.length} of {users.length} users
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                Previous
              </button>
              <span className="px-3 py-1 bg-blue-600 text-white rounded">1</span>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Verification Rate</p>
              <h3 className="text-2xl font-bold mt-2">
                {users.length > 0 
                  ? Math.round((users.filter(u => u.isVerified).length / users.length) * 100) 
                  : 0}%
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaCheckCircle className="text-green-600 text-2xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Avg. Verification Attempts</p>
              <h3 className="text-2xl font-bold mt-2">
                {users.length > 0 
                  ? (users.reduce((sum, user) => sum + user.verificationAttempts, 0) / users.length).toFixed(1)
                  : 0}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaKey className="text-blue-600 text-2xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Users This Month</p>
              <h3 className="text-2xl font-bold mt-2">12</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaUserCircle className="text-purple-600 text-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;