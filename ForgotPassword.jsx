
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordUser } from '../api/authApi';
import { Brand } from '../components/Navbar';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const response = await forgotPasswordUser(email);
            setMessage(
                response.data?.message ||
                'If the account exists, follow the password-reset instructions.'
            );
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Password recovery is not available yet. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-wrap">
                <Brand />

                <form className="panel auth-card" onSubmit={handleSubmit}>
                    <h2>Forgot Password?</h2>
                    <p className="auth-sub">
                        Enter your registered email to request a password reset.
                    </p>

                    {message && (
                        <div className="success-box" role="status">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="error-box" role="alert">
                            {error}
                        </div>
                    )}

                    <label htmlFor="reset-email">Email address</label>
                    <input
                        id="reset-email"
                        type="email"
                        name="email"
                        placeholder="Enter your registered email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />

                    <button
                        className="btn btn-primary btn-block"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Sending request...' : 'Reset Password'}
                    </button>

                    <p className="auth-switch">
                        Remember your password? <Link to="/">Back to Login</Link>

                    </p>
                </form>
            </div>
        </div>
    );
}
