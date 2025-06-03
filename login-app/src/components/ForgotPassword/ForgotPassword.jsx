import { useState } from 'react';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './ForgotPassword.css';

// Schema de validação
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('E-mail inválido')
    .required('E-mail é obrigatório')
});

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleSubmit = (values, { setSubmitting }) => {
    setGeneralError('');
    
    // Simulação de envio de e-mail
    setTimeout(() => {
      console.log('Solicitação de recuperação para:', values.email);
      setEmailSent(true);
      setSubmitting(false);
    }, 1500);
  };

  return (
    <div className="forgot-password-container">
      <h2>Recuperação de Senha</h2>
      
      {generalError && <div className="error-message">{generalError}</div>}
      
      {!emailSent ? (
        <>
          <p className="instructions">
            Digite seu e-mail cadastrado e enviaremos instruções para redefinir sua senha.
          </p>
          
          <Formik
            initialValues={{ email: '' }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors }) => (
              <Form className="forgot-password-form">
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
                
                <button 
                  type="submit" 
                  className="submit-button" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Instruções'}
                </button>
                
                <div className="login-link">
                  <Link to="/login" className="back-link">
                    <FaArrowLeft /> Voltar para o login
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </>
      ) : (
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h3>E-mail Enviado!</h3>
          <p>
            Enviamos instruções para redefinir sua senha para o e-mail informado.
            Por favor, verifique sua caixa de entrada e spam.
          </p>
          <Link to="/login" className="back-button">
            Voltar para o login
          </Link>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
