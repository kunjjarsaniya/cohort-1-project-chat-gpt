import React, { useState, useEffect } from 'react';
import '../styles/register-animations.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
// You can swap this for a local SVG or Unsplash image for more branding
const illustrationUrl = 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80';


const Login = () => {
    const [ form, setForm ] = useState({ email: '', password: '' });
    const [ submitting, setSubmitting ] = useState(false);
    const navigate = useNavigate();
    

    function handleChange(e) {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);


        console.log(form);

        axios.post("http://localhost:3000/api/auth/login", {
            email: form.email,
            password: form.password
        },
            {
                withCredentials: true
            }
        ).then((res) => {
            console.log(res);
            navigate("/");
        }).catch((err) => {
            console.error(err);
        }).finally(() => {
            setSubmitting(false);
        });

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
                <div className="auth-card register-animate-card register-glass-card" role="main" aria-labelledby="login-heading">
                    <header className="auth-header register-animate-header">
                        <h1 id="login-heading">Sign in</h1>
                        <p className="auth-sub">Welcome back. We've missed you.</p>
                    </header>
                    <form className="auth-form register-animate-form" onSubmit={handleSubmit} noValidate>
                        <div className="field-group">
                            <label htmlFor="login-email">Email</label>
                            <input id="login-email" name="email" type="email" autoComplete="email" placeholder="you@example.com"  onChange={handleChange} required />
                        </div>
                        <div className="field-group">
                            <label htmlFor="login-password">Password</label>
                            <input id="login-password" name="password" type="password" autoComplete="current-password" placeholder="Your password"  onChange={handleChange} required />
                        </div>
                        <button type="submit" className="primary-btn register-animate-btn" disabled={submitting}>
                            {submitting ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>
                    <p className="auth-alt">Need an account? <Link to="/register">Create one</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;

