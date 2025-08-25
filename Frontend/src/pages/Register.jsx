import React, { useState, useEffect } from 'react';
import '../styles/register-animations.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// You can swap this for a local SVG or Unsplash image for more branding
const illustrationUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80';

const Register = () => {
    const [ form, setForm ] = useState({ email: '', firstname: '', lastname: '', password: '' });
    const [ submitting, setSubmitting ] = useState(false);
    const navigate = useNavigate();


    function handleChange(e) {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [ name ]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        console.log(form);

        axios.post("http://localhost:3000/api/auth/register", {
            email: form.email,
            fullName: {
                firstName: form.firstname,
                lastName: form.lastname
            },
            password: form.password
        }, {
            withCredentials: true
        }).then((res) => {
            console.log(res);
            navigate("/");
        }).catch((err) => {
            console.error(err);
            alert('Registration failed (placeholder)');
        })

        try {
            // Placeholder: integrate real registration logic / API call.

        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    }

    // Add black & white theme class to body for this page
    useEffect(() => {
        document.body.classList.add('bw-theme');
        return () => document.body.classList.remove('bw-theme');
    }, []);

    return (
        <div className="register-modern-bg">
            <div className="register-modern-container">
                <div className="register-illustration">
                    <img src={illustrationUrl} alt="Welcome" />
                </div>
                <div className="auth-card register-animate-card register-glass-card" role="main" aria-labelledby="register-heading">
                    <header className="auth-header register-animate-header">
                        <h1 id="register-heading">Create account</h1>
                        <p className="auth-sub">Join us and start exploring.</p>
                    </header>
                    <form className="auth-form register-animate-form" onSubmit={handleSubmit} noValidate>
                        <div className="field-group">
                            <label htmlFor="email">Email</label>
                            <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                        </div>
                        <div className="grid-2">
                            <div className="field-group">
                                <label htmlFor="firstname">First name</label>
                                <input id="firstname" name="firstname" placeholder="Jane" value={form.firstname} onChange={handleChange} required />
                            </div>
                            <div className="field-group">
                                <label htmlFor="lastname">Last name</label>
                                <input id="lastname" name="lastname" placeholder="Doe" value={form.lastname} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="field-group">
                            <label htmlFor="password">Password</label>
                            <input id="password" name="password" type="password" autoComplete="new-password" placeholder="Create a password" value={form.password} onChange={handleChange} required minLength={6} />
                        </div>
                        <button type="submit" className="primary-btn register-animate-btn" disabled={submitting}>
                            {submitting ? 'Creating...' : 'Create Account'}
                        </button>
                    </form>
                    <p className="auth-alt">Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;

