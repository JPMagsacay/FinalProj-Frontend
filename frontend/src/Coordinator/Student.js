import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Coordinator/components/sidebar';
import '../css/Dashboard.css';
import '../css/Track.css';
import axios from 'axios';
import Swal from 'sweetalert2';

const Students = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  const [studentId, setStudentId] = useState('');
  const [lname, setLname] = useState('');
  const [fname, setFname] = useState('');
  const [mname, setMname] = useState('');
  const [suffix, setSuffix] = useState('');
  const [email, setEmail] = useState('');
  const [Phone_number, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const coordinatorData = localStorage.getItem('coordinator');
    if (!coordinatorData) {
      navigate('/Coordinator/Login');
    } else {
      fetchStudents();
    }
  }, [navigate]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/students');
      setStudents(res.data.students || res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const clearForm = () => {
    setStudentId('');
    setLname('');
    setFname('');
    setMname('');
    setSuffix('');
    setEmail('');
    setPhoneNumber('');
    setGender('');
    setStatus('');
    setIsEdit(false);
    setCurrentStudent(null);
  };

  const openAddModal = () => {
    clearForm();
    setShowModal(true);
  };

  const openEditModal = (student) => {
    Swal.fire({
      title: `Edit "${student.fname} ${student.lname}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, edit',
    }).then((result) => {
      if (result.isConfirmed) {
        setStudentId(student.student_id);
        setLname(student.lname || '');
        setFname(student.fname || '');
        setMname(student.mname || '');
        setSuffix(student.suffix || '');
        setEmail(student.email || '');
        setPhoneNumber(student.Phone_number || '');
        setGender(student.gender || '');
        setStatus(student.status || '');
        setCurrentStudent(student);
        setIsEdit(true);
        setShowModal(true);
      }
    });
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8000/api/DeleteStudent/${id}`);
        Swal.fire('Deleted!', 'Student has been deleted.', 'success');
        fetchStudents();
      } catch (err) {
        console.error('Delete failed:', err);
        Swal.fire('Error!', 'Failed to delete student.', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Mapping status to backend values
    const mappedStatus = status === 'Active' ? '1' : '0';
  
    if (!isEdit && !/^[\d-]+$/.test(studentId)) {
      Swal.fire('❌ Invalid ID!', 'Student ID must be numbers only.', 'error');
      return;
    }
  
    if (!/\S+@\S+\.\S+/.test(email)) {
      Swal.fire('❌ Invalid Email!', 'Please enter a valid email address.', 'error');
      return;
    }
  
    if (!/^\d{11}$/.test(Phone_number)) {
      Swal.fire('❌ Invalid Phone Number!', 'Phone number must be 11 digits long.', 'error');
      return;
    }
  
    try {
      if (isEdit && currentStudent) {
        const updateData = {
          lname,
          fname,
          mname,
          suffix,
          email,
          Phone_number: Phone_number,
          gender,
          status: mappedStatus,  // Send the mapped status
        };
  
        await axios.put(`http://localhost:8000/api/UpdateStudent/${currentStudent.student_id}`, updateData);
        Swal.fire('✅ Updated!', 'Student updated successfully!', 'success');
      } else {
        const newStudentData = {
          student_id: studentId,
          password: 'password123',
          lname,
          fname,
          mname,
          suffix,
          email,
          Phone_number: Phone_number,
          gender,
          status: mappedStatus,  // Send the mapped status
        };
  
        await axios.post('http://localhost:8000/api/addstudents', newStudentData);
        Swal.fire('✅ Added!', 'New student added successfully!', 'success');
      }
  
      setShowModal(false);
      fetchStudents();
      clearForm();
    } catch (err) {
      console.error('Error:', err.response?.data || err.message);
      Swal.fire('❌ Failed!', `Failed to save student: ${err.response?.data?.message || err.message}`, 'error');
    }
  };
  

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h1>Student Management</h1>
        <button onClick={openAddModal} style={{ marginBottom: '10px' }}>
          ➕ Add New Student
        </button>

        <table border="1" width="100%" cellPadding="10">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Last Name</th>
              <th>First Name</th>
              <th>Middle Name</th>
              <th>Suffix</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={`${student.student_id}-${index}`}>
                <td>{student.student_id}</td>
                <td>{student.lname}</td>
                <td>{student.fname}</td>
                <td>{student.mname}</td>
                <td>{student.suffix}</td>
                <td>{student.email}</td>
                <td>{student.Phone_number}</td>
                <td>{student.gender}</td>
                <td>{student.status === '1' ? 'Active' : 'Inactive'}</td>

                <td>
                  <button onClick={() => openEditModal(student)}>✏️ Edit</button>
                  <button
                    onClick={() => handleDelete(student.student_id)}
                    style={{ marginLeft: '10px' }}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '10px',
                width: '400px',
              }}
            >
              <h2>{isEdit ? 'Edit Student' : 'Add Student'}</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                  style={{ width: '100%', marginBottom: '10px' }}
                  disabled={isEdit}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                  required
                  style={{ width: '100%', marginBottom: '10px' }}
                />
                <input
                  type="text"
                  placeholder="First Name"
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  required
                  style={{ width: '100%', marginBottom: '10px' }}
                />
                <input
                  type="text"
                  placeholder="Middle Name"
                  value={mname}
                  onChange={(e) => setMname(e.target.value)}
                  style={{ width: '100%', marginBottom: '10px' }}
                />
                <input
                  type="text"
                  placeholder="Suffix"
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  style={{ width: '100%', marginBottom: '10px' }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', marginBottom: '10px' }}
                />
                <input
                  type="text"
                  placeholder="Phone "
                  value={Phone_number}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  style={{ width: '100%', marginBottom: '10px' }}
                />
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  style={{ width: '100%', marginBottom: '10px' }}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ width: '100%', marginBottom: '10px' }}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <button type="submit" style={{ width: '100%' }}>
                  {isEdit ? 'Update' : 'Add'} Student
                </button>
              </form>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                  padding: '5px 10px',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '10px',
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
