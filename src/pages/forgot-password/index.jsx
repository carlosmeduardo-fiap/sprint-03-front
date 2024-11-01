import { useNavigate } from 'react-router-dom';

import './styles.css';

function ForgotPassword() {
  const navigate = useNavigate();

  async function handleResetPassword(event) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    if (!email) {
      alert('E-mail é obrigatório');
      return;
    }

    if (!password) {
      alert('Senha é obrigatória');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao recuperar: ' + response.statusText);
      }

      navigate('/');
    } catch (error) {
      alert('O e-mail informado não está cadastrado!');
      console.error('Erro ao recuperar:', error);
    }
  }

  return (
    <div className="container">
      <h1>Sign In</h1>

      <form onSubmit={handleResetPassword}>
        <div className="form-field">
          <label>E-mail:</label>
          <input type="email" name='email' />
        </div>

        <div className="form-field">
          <label>Nova senha:</label>
          <input type="password" name="password" />
        </div>

        <button type="submit">Recuperar</button>
      </form>
    </div>
  )
}

export default ForgotPassword;