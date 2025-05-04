import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Coordinator/components/sidebar';
import '../css/Dashboard.css';
import '../css/Track.css';
import axios from 'axios';
import Swal from 'sweetalert2';

const Track = () => {
  const navigate = useNavigate();

  const [tracks, setTracks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);

  const [trackId, setTrackId] = useState('');
  const [trackName, setTrackName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const coordinatorData = localStorage.getItem('coordinator');
    if (!coordinatorData) {
      navigate('/Coordinator/Login');
    } else {
      fetchTracks();
    }
  }, [navigate]);

  const fetchTracks = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/ShowTracks');
      console.log('Tracks fetched:', res.data);

      if (Array.isArray(res.data)) {
        setTracks(res.data);
      } else if (Array.isArray(res.data?.tracks)) {
        setTracks(res.data.tracks);
      } else {
        setTracks([]);
        console.error('Unexpected API response format:', res.data);
      }
    } catch (err) {
      console.error('Error fetching tracks:', err);
      setTracks([]);
    }
  };

  const openAddModal = () => {
    setTrackId('');
    setTrackName('');
    setDescription('');
    setIsEdit(false);
    setShowModal(true);
  };

  const openEditModal = (track) => {
    Swal.fire({
      title: `Edit "${track.track_name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, edit',
    }).then((result) => {
      if (result.isConfirmed) {
        setTrackId(track.track_id);
        setTrackName(track.track_name);
        setDescription(track.description);
        setCurrentTrack(track);
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
        await axios.delete(`http://localhost:8000/api/DeleteTrack/${id}`);
        Swal.fire('Deleted!', 'Track has been deleted.', 'success');
        fetchTracks();
      } catch (err) {
        console.error('Delete failed:', err);
        Swal.fire('Error!', 'Failed to delete track.', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEdit) {
      if (!/^\d+$/.test(trackId)) {
        Swal.fire('❌ Invalid ID!', 'Track ID must be numbers only.', 'error');
        return;
      }
    }

    try {
      if (isEdit && currentTrack) {
        const trackData = {
          track_name: trackName,
          description: description,
        };

        await axios.put(`http://localhost:8000/api/UpdateTrack/${currentTrack.track_id}`, trackData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        Swal.fire('✅ Updated!', 'Track updated successfully!', 'success');
      } else {
        const trackData = {
          track_id: trackId,
          track_name: trackName,
          description: description,
        };

        await axios.post('http://localhost:8000/api/tracks', trackData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        Swal.fire('✅ Added!', 'New track added successfully!', 'success');
      }

      setShowModal(false);
      setTrackId('');
      setTrackName('');
      setDescription('');
      setCurrentTrack(null);
      fetchTracks();
    } catch (err) {
      console.error('Error during save:', err);

      const errorMessage = err.response?.data?.error || err.response?.data?.message || '';
      if (errorMessage.includes('1062 Duplicate entry')) {
        Swal.fire('❌ Duplicate ID!', 'Track ID already exists in the database.', 'error');
      } else {
        Swal.fire('❌ Failed!', 'Failed to save track. Please try again.', 'error');
      }
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <h1>Track Management</h1>
        <button onClick={openAddModal} className="add-track-btn">
          ➕ Add New Track
        </button>

        <table border="1" width="100%" cellPadding="10">
          <thead>
            <tr>
              <th>Track ID</th>
              <th>Track Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tracks.length > 0 ? (
              tracks.map((track) => (
                <tr key={track.track_id}>
                  <td>{track.track_id}</td>
                  <td>{track.track_name}</td>
                  <td>{track.description}</td>
                  <td>
                    <button onClick={() => openEditModal(track)} className="edit-btn">✏️ Edit</button>
                    <button onClick={() => handleDelete(track.track_id)} className="delete-btn">🗑️ Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-tracks">No tracks found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>{isEdit ? 'Edit Track' : 'Add Track'}</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Track ID"
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  required
                  className="modal-input"
                  disabled={isEdit}
                />
                <input
                  type="text"
                  placeholder="Track Name"
                  value={trackName}
                  onChange={(e) => setTrackName(e.target.value)}
                  required
                  className="modal-input"
                />
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="modal-textarea"
                />
                <button type="submit" className="modal-submit-btn">
                  {isEdit ? 'Update' : 'Save'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="modal-cancel-btn">Cancel</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Track;
