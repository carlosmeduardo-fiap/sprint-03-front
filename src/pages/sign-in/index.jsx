import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './styles.css';

function SignIn() {
  const navigate = useNavigate();

  async function handleSignIn(event) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;
    const role = event.target.role.value;

    if (!email) {
      alert('E-mail é obrigatório');
      return;
    }

    if (!password) {
      alert('Senha é obrigatória');
      return;
    }

    if (!role) {
      alert('Cargo é obrigatório');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          role,
        })
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        throw new Error('Erro ao autenticar: ' + response.statusText);
      }

      localStorage.setItem('token', data.token);

      navigate('/')
    } catch (error) {
      alert('E-mail ou senha inválido');
      console.error('Erro ao autenticar:', error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      navigate('/');
    }
  }, [navigate])

  return (
    <div className="container">
      <h1>Sign In</h1>

      <form onSubmit={handleSignIn}>
        <div className="form-field">
          <label>E-mail:</label>
          <input type="email" name='email' />
        </div>

        <div className="form-field">
          <label>Senha:</label>
          <input type="password" name="password" />
        </div>

        <div className='form-field'>
          <label>Cargo:</label>

          <div>
            <div>
              <input type="radio" name="role" value="USER" defaultChecked />
              <label>Usuário</label>
            </div>

            <div>
              <input type="radio" name="role" value="ADMIN" />
              <label>Administrador</label>
            </div>
          </div>
        </div>

        <button type="submit">Entrar</button>

        <Link to="/auth/forgot-password">Esqueceu sua senha?</Link>
      </form>
    </div>
  )
}

export default SignIn;