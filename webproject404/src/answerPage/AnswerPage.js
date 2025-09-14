import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Modal, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { authFetch } from '../services/authService.js';

const AnswerPage = () => {
    const { formId } = useParams();
    const [started, setStarted] = useState(false);
    const [formData, setFormData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [formDetails, setFormDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const fetchFormDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await authFetch(`https://webproject404-backend.darkube.app/api/forms/${formId}/fields`);
            if (!response.ok) throw new Error('Failed to load form details');
            const data = await response.json();
            setFormDetails(data);

            // Initialize form data with empty values
            const initialData = {};
            data.fields.forEach(field => {
                initialData[field.id] = field.type === 'checkbox' ? [] : '';
            });
            setFormData(initialData);
        } catch (err) {
            setError('Failed to load form details');
            console.error('Error fetching form:', err);
        } finally {
            setLoading(false);
        }
    }, [formId]);

    useEffect(() => {
        fetchFormDetails();
    }, [fetchFormDetails]);

    const isFormValid = () => {
        if (!formDetails) return false;

        return formDetails.fields.every(field => {
            if (!field.requiredField) return true;

            const value = formData[field.id];
            if (field.type === 'checkbox') {
                return Array.isArray(value) && value.length > 0;
            }
            return value && value.toString().trim() !== '';
        });
    };

    const handleChange = (fieldId, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldId]: value
        }));
    };

    const handleNumberChange = (fieldId, value) => {
        // Only allow numbers and empty string
        if (value === '' || /^\d+$/.test(value)) {
            setFormData(prev => ({
                ...prev,
                [fieldId]: value
            }));
        }
    };

    const handleCheckboxChange = (fieldId, option, checked) => {
        setFormData(prev => {
            const currentValues = Array.isArray(prev[fieldId]) ? prev[fieldId] : [];
            if (checked) {
                return { ...prev, [fieldId]: [...currentValues, option] };
            } else {
                return { ...prev, [fieldId]: currentValues.filter(v => v !== option) };
            }
        });
    };

    const handleStart = () => setStarted(true);
    const handleBack = () => navigate('/explore');
    const handleSubmit = () => setShowModal(true);

    const confirmSubmit = async () => {
        try {
            setSubmitting(true);
            setShowModal(false);

            const submissionData = {
                formId: parseInt(formId),
                userId: null, // anonymous
                answers: formData
            };

            const response = await authFetch('https://webproject404-backend.darkube.app/api/form-submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData)
            });

            if (!response.ok) throw new Error('Failed to submit form');

            navigate('/explore', { state: { message: 'Form submitted successfully!' } });
        } catch (err) {
            setError('Failed to submit form');
            console.error('Error submitting form:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const renderField = (field, index) => {
        const fieldId = field.id;
        const options = field.options ? field.options.split(';').map(opt => opt.trim()) : [];

        switch (field.type) {
            case 'text':
            case 'short-text':
                return (
                    <Form.Group className="mb-4" key={fieldId}>
                        <Form.Label>
                            <strong>{index + 1}. {field.label}</strong>
                            {field.requiredField && <span className="text-danger"> *</span>}
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            value={formData[fieldId] || ''}
                            onChange={(e) => handleChange(fieldId, e.target.value)}
                            required={field.requiredField}
                        />
                    </Form.Group>
                );

            case 'number':
                return (
                    <Form.Group className="mb-4" key={fieldId}>
                        <Form.Label>
                            <strong>{index + 1}. {field.label}</strong>
                            {field.requiredField && <span className="text-danger"> *</span>}
                        </Form.Label>
                        <Form.Control
                            type="text"
                            placeholder={`Enter a number`}
                            value={formData[fieldId] || ''}
                            onChange={(e) => handleNumberChange(fieldId, e.target.value)}
                            required={field.requiredField}
                            pattern="\d*"
                            inputMode="numeric"
                        />
                    </Form.Group>
                );

            case 'textarea':
            case 'long-text':
                return (
                    <Form.Group className="mb-4" key={fieldId}>
                        <Form.Label>
                            <strong>{index + 1}. {field.label}</strong>
                            {field.requiredField && <span className="text-danger"> *</span>}
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            value={formData[fieldId] || ''}
                            onChange={(e) => handleChange(fieldId, e.target.value)}
                            required={field.requiredField}
                        />
                    </Form.Group>
                );

            case 'radio':
            case 'multiple-choice':
                return (
                    <Form.Group className="mb-4" key={fieldId}>
                        <Form.Label>
                            <strong>{index + 1}. {field.label}</strong>
                            {field.requiredField && <span className="text-danger"> *</span>}
                        </Form.Label>
                        <div className="mt-2">
                            {options.map((option, optIndex) => (
                                <Form.Check
                                    key={optIndex}
                                    type="radio"
                                    name={`field_${fieldId}`}
                                    id={`field_${fieldId}_option_${optIndex}`}
                                    label={option}
                                    value={option}
                                    checked={formData[fieldId] === option}
                                    onChange={(e) => handleChange(fieldId, e.target.value)}
                                    className="mb-2"
                                />
                            ))}
                        </div>
                    </Form.Group>
                );

            case 'checkbox':
                return (
                    <Form.Group className="mb-4" key={fieldId}>
                        <Form.Label>
                            <strong>{index + 1}. {field.label}</strong>
                            {field.requiredField && <span className="text-danger"> *</span>}
                        </Form.Label>
                        <div className="mt-2">
                            {options.map((option, optIndex) => (
                                <Form.Check
                                    key={optIndex}
                                    type="checkbox"
                                    id={`field_${fieldId}_checkbox_${optIndex}`}
                                    label={option}
                                    checked={Array.isArray(formData[fieldId]) && formData[fieldId].includes(option)}
                                    onChange={(e) => handleCheckboxChange(fieldId, option, e.target.checked)}
                                    className="mb-2"
                                />
                            ))}
                        </div>
                    </Form.Group>
                );

            case 'boolean':
                return (
                    <Form.Group className="mb-4" key={fieldId}>
                        <Form.Label>
                            <strong>{index + 1}. {field.label}</strong>
                            {field.requiredField && <span className="text-danger"> *</span>}
                        </Form.Label>
                        <div className="mt-2">
                            <Form.Check
                                type="radio"
                                name={`field_${fieldId}`}
                                id={`field_${fieldId}_yes`}
                                label="Yes"
                                value="yes"
                                checked={formData[fieldId] === 'yes'}
                                onChange={(e) => handleChange(fieldId, e.target.value)}
                                className="mb-2"
                            />
                            <Form.Check
                                type="radio"
                                name={`field_${fieldId}`}
                                id={`field_${fieldId}_no`}
                                label="No"
                                value="no"
                                checked={formData[fieldId] === 'no'}
                                onChange={(e) => handleChange(fieldId, e.target.value)}
                                className="mb-2"
                            />
                        </div>
                    </Form.Group>
                );
            case 'yes-no':
                return (
                    <Form.Group className="mb-4" key={fieldId}>
                        <Form.Label>
                            <strong>{index + 1}. {field.label}</strong>
                            {field.requiredField && <span className="text-danger"> *</span>}
                        </Form.Label>
                        <div className="mt-2">
                            <Form.Check
                                type="radio"
                                name={`field_${fieldId}`}
                                id={`field_${fieldId}_yes`}
                                label="Yes"
                                value="yes"
                                checked={formData[fieldId] === 'yes'}
                                onChange={(e) => handleChange(fieldId, e.target.value)}
                                className="mb-2"
                            />
                            <Form.Check
                                type="radio"
                                name={`field_${fieldId}`}
                                id={`field_${fieldId}_no`}
                                label="No"
                                value="no"
                                checked={formData[fieldId] === 'no'}
                                onChange={(e) => handleChange(fieldId, e.target.value)}
                                className="mb-2"
                            />
                        </div>
                    </Form.Group>
                );

            default:
                return (
                    <div key={fieldId} className="mb-4">
                        <Alert variant="warning">
                            Unsupported field type: {field.type}
                        </Alert>
                    </div>
                );
        }
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center">
                <Alert variant="danger">{error}</Alert>
            </div>
        );
    }

    return (
        <div
            className="min-vh-100 d-flex flex-column align-items-center pt-5 px-3"
            style={{ background: 'linear-gradient(to bottom, #B8C6FF, #EEFFCF)' }}
        >
            <div className="w-100" style={{ maxWidth: '700px' }}>
                <Button
                    variant="secondary"
                    onClick={handleBack}
                    className="mb-4"
                    disabled={submitting}
                >
                    ← Back to Explore
                </Button>

                {!started ? (
                    <div className="text-center bg-white p-4 rounded shadow">
                        <h4>{formDetails?.title || formDetails?.name || 'Form'}</h4>
                        {formDetails?.description && (
                            <p className="text-muted mt-2">{formDetails.description}</p>
                        )}
                        <p className="mt-3">Are you ready to answer the questions?</p>
                        <Button onClick={handleStart} variant="primary" className="mt-3">
                            Let's go
                        </Button>
                    </div>
                ) : (
                    <Form className="bg-white p-4 rounded shadow">
                        <h4 className="mb-4">{formDetails?.title || formDetails?.name || 'Form'}</h4>
                        {formDetails?.description && (
                            <p className="text-muted mb-4">{formDetails.description}</p>
                        )}

                        {formDetails?.fields?.map((field, index) => renderField(field, index))}

                        <div className="d-flex justify-content-between mt-4">
                            <Button
                                variant="outline-secondary"
                                onClick={() => setStarted(false)}
                                disabled={submitting}
                            >
                                Back
                            </Button>
                            <Button
                                variant="success"
                                onClick={handleSubmit}
                                disabled={!isFormValid() || submitting}
                            >
                                {submitting ? 'Submitting...' : 'Submit'}
                            </Button>
                        </div>
                    </Form>
                )}
            </div>

            {/* Confirmation Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Submission</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to submit your answers?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={confirmSubmit}>
                        Yes, Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AnswerPage;