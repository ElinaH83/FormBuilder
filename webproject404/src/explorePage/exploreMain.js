import React, { useEffect, useState, useCallback } from 'react';
import { authFetch, getUserId } from '../services/authService.js';
import './exploreMain.css';
import { useNavigate } from 'react-router-dom';

const ExploreMain = () => {
  const currentUserId = getUserId();
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showSortOptions, setShowSortOptions] = useState(false);

  const fetchForms = useCallback(async () => {
    try {
      const res = await authFetch('https://webproject404-backend.darkube.app/api/forms');
      if (!res.ok) throw new Error('Failed to fetch forms');
      const formsData = await res.json();

      const enrichedForms = await Promise.all(
        formsData.map(async (form) => {
          try {
            const submissionsRes = await authFetch(
              `https://webproject404-backend.darkube.app/api/form-submissions?formId=${form.id}&userId=${currentUserId}`
            );
            if (!submissionsRes.ok) throw new Error('Failed to fetch submissions');
            const submissions = await submissionsRes.json();

            const latestSubmission = submissions.length > 0 ? submissions[0] : null;

            return {
              ...form,
              createdAt: latestSubmission?.createdAt || null,
              submissionId: latestSubmission?.id || null, 
            };
          } catch (err) {
            console.error(`Error fetching submissions for form ${form.id}:`, err);
            return { ...form, createdAt: null, submissionId: null };
          }
        })
      );

      setForms(enrichedForms);
    } catch (err) {
      console.error("Error fetching forms:", err);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const deleteSubmissionForUser = async (submissionId) => {
    if (!submissionId) {
      alert("No submission to delete.");
      return;
    }
    try {
      const res = await authFetch(`https://webproject404-backend.darkube.app/api/form-submissions/${submissionId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete submission');
      alert("Submission deleted successfully.");
      fetchForms();
    } catch (err) {
      console.error("Error deleting submission:", err);
      alert(err.message || "Failed to delete submission.");
    }
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setShowSortOptions(false);
  };

  const filteredForms = forms
    .filter(form => form.title?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      let valA, valB;

      if (sortBy === 'name') {
        valA = a.title?.toLowerCase() || '';
        valB = b.title?.toLowerCase() || '';
      } else if (sortBy === 'date') {
        valA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        valB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  if (filteredForms.length === 0) {
    return (
      <div className="text-center mt-5">
        <h4>No form created.</h4>
      </div>
    );
  }

  return (
    <div className="main-page-content p-4">
      <div className="main-header d-flex justify-content-between align-items-center mb-4">
        <h2>All Forms</h2>
        <div className="d-flex align-items-center gap-3">
          <input
            type="text"
            placeholder="Search by form name..."
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: '250px' }}
          />
          <div className="sort-dropdown position-relative">
            <button className="btn btn-outline-secondary" onClick={() => setShowSortOptions(!showSortOptions)}>
              Sort by: {sortBy} {sortOrder === 'asc' ? '▲' : '▼'}
            </button>
            {showSortOptions && (
              <div className="sort-options position-absolute bg-white border rounded p-2" style={{ zIndex: 10 }}>
                <div className="cursor-pointer" onClick={() => toggleSort('name')}>Name</div>
                <div className="cursor-pointer" onClick={() => toggleSort('date')}>Date</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {filteredForms.map((form) => (
        <div className="form-block border rounded p-3 mb-3 shadow-sm" key={form.id}>
          <div className="form-header d-flex justify-content-between align-items-center">
            <h5 className="form-name mb-0">{form.title}</h5>
            <div className="form-actions d-flex gap-2">
              <button className="btn btn-sm btn-primary" onClick={() => navigate(`/answer/${form.id}`)}>Edit</button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => deleteSubmissionForUser(form.submissionId)}
                disabled={!form.submissionId}
                title={!form.submissionId ? "No submission to delete" : ""}
              >
                Delete
              </button>
            </div>
          </div>
          <div className="form-body mt-2">
            <div><strong>Creator:</strong> {form.creator?.username || 'Unknown'}</div>
            <div><strong>Created At:</strong>{' '}
              {form.createdAt ? form.createdAt.replace('T', ' ').substring(0, 19) : 'Not answered yet'}
            </div>
            <div><strong>Description:</strong> {form.description || 'No description'}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExploreMain;