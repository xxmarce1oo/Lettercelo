import { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './Login.css';

// Schema de validação com Yup
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('E-mail inválido')
    .required('E-mail é obrigatório'),
  password: Yup.string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória')
});

const Login = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleSubmit = (values, { setSubmitting }) => {
    try {
      // Limpa erros gerais
      setGeneralError('');
      // Chama a função de login
      onLogin(values.email, values.password);
    } catch (error) {
      setGeneralError('Erro ao fazer login. Tente novamente.');
      console.error('Login error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {generalError && <div className="error-message">{generalError}</div>}
      
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, touched, errors }) => (
          <Form className="login-form">
            <div className="input-group">
              <label htmlFor="email">E-mail</label>
              <div className={`input-wrapper ${touched.email && errors.email ? 'error' : ''}`}>
                <FaEnvelope className="input-icon" />
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  aria-required="true"
                />
              </div>
              <ErrorMessage name="email" component="div" className="field-error" />
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Senha</label>
              <div className={`input-wrapper ${touched.password && errors.password ? 'error' : ''}`}>
                <FaLock className="input-icon" />
                <Field
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sua senha"
                  autoComplete="current-password"
                  aria-required="true"
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <ErrorMessage name="password" component="div" className="field-error" />
            </div>
            
            <div className="forgot-password">
              <Link to="/forgot-password">Esqueceu sua senha?</Link>
            </div>
            
            <button 
              type="submit" 
              className="login-button" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
            
            <div className="signup-link">
              Não tem uma conta? <Link to="/signup">Cadastre-se</Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
