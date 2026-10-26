
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLoginUser } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

export default function SocialButtons() {
  const googleButtonRef = useRef(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    let active = true;

    const initializeGoogle = () => {
      if (!active || !googleButtonRef.current) return;

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

      if (!clientId) {
        setNote(
            'Google sign-in is not configured. Check your frontend .env file.'
        );
        return;
      }

      if (!window.google?.accounts?.id) {
        setNote(
            'Google sign-in could not load. Check your internet connection.'
        );
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          if (!response.credential) {
            setNote('Google did not return a credential.');
            return;
          }

          setLoading(true);
          setNote('');

          try {
            const result = await googleLoginUser(response.credential);

            if (!active) return;

            login(result.data);
            navigate('/dashboard');
          } catch (error) {
            if (!active) return;

            setNote(
                error.response?.data?.message ||
                'Google sign-in failed. Check your configuration and try again.'
            );
          } finally {
            if (active) setLoading(false);
          }
        },
      });

      googleButtonRef.current.innerHTML = '';

      window.google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            width: 300,
          }
      );
    };

    const scriptUrl = 'https://accounts.google.com/gsi/client';
    let script = document.querySelector(
        `script[src="${scriptUrl}"]`
    );

    if (window.google?.accounts?.id) {
      initializeGoogle();
    } else if (script) {
      script.addEventListener('load', initializeGoogle);
    } else {
      script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      script.onerror = () => {
        if (active) {
          setNote(
              'Could not load Google sign-in. Check your internet connection.'
          );
        }
      };

      document.head.appendChild(script);
    }

    return () => {
      active = false;
      script?.removeEventListener('load', initializeGoogle);
    };
  }, [login, navigate]);

  return (
      <>
        <div className="or">or</div>

        <div
            ref={googleButtonRef}
            className="btn-block"
            aria-label="Continue with Google"
        />

        {loading && (
            <p className="soc-note" role="status">
              Signing in with Google...
            </p>
        )}

        {note && (
            <p className="soc-note" role="status">
              {note}
            </p>
        )}
      </>
  );
}

