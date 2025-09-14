import React, { useState } from 'react';
import './DesignFormPage.css';
import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { authFetch } from '../services/authService.js';

const DesignFormPage = () => {
    const { formId } = useParams();
    const [formTitle, setFormTitle] = useState('Untitled Form');
    const [formDescription, setFormDescription] = useState('');
    const [headerImage, setHeaderImage] = useState(null);
    const [fields, setFields] = useState([]);
    const [published, setPublished] = useState(false);
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => setHeaderImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const addField = () => {
        setFields([
            ...fields,
            {
                id: Date.now(),
                label: 'Untitled Question',
                type: 'short-text',
                required: false,
                options: ['Option 1'],
            },
        ]);
    };

    const updateField = (id, key, value) => {
        setFields(fields.map(field => field.id === id ? { ...field, [key]: value } : field));
    };

    const updateOption = (id, index, value) => {
        setFields(fields.map(field =>
            field.id === id
                ? { ...field, options: field.options.map((opt, i) => i === index ? value : opt) }
                : field
        ));
    };

    const addOption = (id) => {
        setFields(fields.map(field =>
            field.id === id
                ? { ...field, options: [...field.options, `Option ${field.options.length + 1}`] }
                : field
        ));
    };

    const handleSaveForm = async () => {
        const formData = { title: formTitle, description: formDescription, headerImage, fields, published };

        try {
            if (formId) {
                const res = await authFetch(`https://webproject404-backend.darkube.app/api/forms/${formId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                if (!res.ok) throw new Error('Failed to update form');
                alert('Form updated!');
            } else {
                const res = await authFetch('https://webproject404-backend.darkube.app/api/forms', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                if (!res.ok) throw new Error('Failed to save form');
                alert('Form saved to backend!');
            }
        } catch (error) {
            console.error('Error saving form:', error);
            alert('Failed to save form.');
        }
    };


    useEffect(() => {
        if (formId) {
            authFetch(`https://webproject404-backend.darkube.app/api/forms/${formId}`)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch form data');
                    return res.json();
                })
                .then(data => {
                    setFormTitle(data.title || 'Untitled Form');
                    setFormDescription(data.description || '');
                    setHeaderImage(data.headerImage || null);
                    setPublished(data.published || false);
                    if (data.fields) {
                        setFields(data.fields.map(field => ({
                            id: field.id,
                            label: field.label,
                            type: field.type,
                            required: field.required,
                            options: field.options || ['Option 1'],
                        })));
                    }
                })
                .catch(err => console.error('Failed to fetch form data:', err));
        }
    }, [formId]);


    return (
        
        <div className="App text-white" style={{ backgroundColor: '#1f1f24', minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* Save Button */}
            <div className="d-flex justify-content-between p-3">
            <Link to="/" className="btn btn-secondary btn-lg">
                ⬅️ Back to Main
            </Link>
            <button className="btn btn-primary btn-lg" onClick={handleSaveForm}>
                💾 Save Form
            </button>
            </div>

            {/* Header Image & Title */}
            <div className="d-flex flex-column align-items-center">
                {headerImage && (
                    <img
                        src={headerImage}
                        alt="Form Header"
                        className="img-fluid rounded mb-3"
                        style={{ maxHeight: '200px', objectFit: 'cover' }}
                    />
                )}
                {/*<div className="mb-3">*/}
                {/*    <label className="btn btn-outline-light">*/}
                {/*        Upload Header Image*/}
                {/*        <input*/}
                {/*            type="file"*/}
                {/*            accept="image/*"*/}
                {/*            onChange={handleImageUpload}*/}
                {/*            style={{ display: 'none' }}*/}
                {/*        />*/}
                {/*    </label>*/}
                {/*</div>*/}
                    <div className="form-check text-start ms-5 mb-4">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="publishToggle"
                            checked={published}
                            onChange={(e) => setPublished(e.target.checked)}
                        />
                        <label className="form-check-label ms-2 fw-bold text-white" htmlFor="publishToggle">
                            Publish Form
                        </label>
                    </div>
                <div className="form-meta p-4 rounded mb-4" style={{ backgroundColor: '#3c4045', width: '80%' }}>
                    <input
                        type="text"
                        className="form-control form-control-lg mb-3 fw-bold text-center"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="Form Title"
                        style={{ fontSize: '1.8rem' }}
                    />
                    <textarea
                        className="form-control text-center"
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Form Description (optional)"
                        rows="3"
                    />
                </div>
            </div>

            {/* Add Question */}
            <div className="text-center mb-4">
                <button className="btn btn-success" onClick={addField}>
                    + Add Question
                </button>
            </div>

            {/* Questions */}
            <div className="d-flex flex-column align-items-center">
                {fields.map((field, index) => (
                    <div key={field.id} className="bg-dark text-white p-3 mb-4 rounded position-relative" style={{ width: '75%' }}>
                        {/* ❌ Delete button in top-right corner above the title */}
                        <div className="d-flex justify-content-end mb-2">
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => setFields(fields.filter(f => f.id !== field.id))}
                            >
                                ❌
                            </button>
                        </div>

                        {/* Title */}
                        <input
                            type="text"
                            className="form-control mb-2"
                            value={field.label}
                            onChange={(e) => updateField(field.id, 'label', e.target.value)}
                            placeholder={`Question ${index + 1}`}
                        />

                        {/* Type */}
                        <select
                            className="form-select mb-2"
                            value={field.type}
                            onChange={(e) => updateField(field.id, 'type', e.target.value)}
                        >
                            <option value="short-text">Short Text</option>
                            <option value="long-text">Long Text</option>
                            <option value="number">Number</option>
                            <option value="boolean">Yes/No (Checkbox)</option>
                            <option value="multiple-choice">Multiple Choice</option>
                        </select>

                        {/* Multiple Choice Options */}
                        {field.type === 'multiple-choice' && (
                            <div className="mb-2">
                                {field.options.map((opt, i) => (
                                    <input
                                        key={i}
                                        type="text"
                                        className="form-control mb-1"
                                        value={opt}
                                        onChange={(e) => updateOption(field.id, i, e.target.value)}
                                        placeholder={`Option ${i + 1}`}
                                    />
                                ))}
                                <button className="btn btn-outline-light btn-sm mt-2" onClick={() => addOption(field.id)}>
                                    + Add Option
                                </button>
                            </div>
                        )}

                        {/* Required Checkbox */}
                        <div className="d-flex align-items-center mt-2">
                        <input
                        type="checkbox"
                        className="form-check-input"
                        checked={field.required}
                        onChange={(e) => updateField(field.id, 'required', e.target.checked)}
                        id={`required-${field.id}`}
                        />
                    <label className="form-check-label ms-2" htmlFor={`required-${field.id}`}>
                    Required
                    </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
    );
};

export default DesignFormPage;
