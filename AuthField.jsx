import { useState } from 'react';
import Icon from './Icon';

// Input with a leading icon; password fields get a show/hide toggle
export default function AuthField({ icon, type = 'text', ...props }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <div className="field">
      <Icon name={icon} />
      <input type={isPassword && show ? 'text' : type} aria-label={props.placeholder} {...props} />
      {isPassword && (
        <button type="button" className="field-eye" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>
          <Icon name="eye" />
        </button>
      )}
    </div>
  );
}
