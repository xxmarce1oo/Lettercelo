import { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import InputMask from 'react-input-mask';
import './Signup.css';

// Schema de validação com Yup
const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Nome muito curto')
    .required('Nome é obrigatório'),
  email: Yup.string()
    .email('E-mail inválido')
    .required('E-mail é obrigatório'),
  cpf: Yup.string()
    .matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, 'CPF inválido')
    .required('CPF é obrigatório'),
  password: Yup.string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
      'A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número'
    )
    .required('Senha é obrigatória'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'As senhas não coincidem')
    .required('Confirmação de senha é obrigatória')
});

// Componente de campo de CPF com máscara
const CPFMaskField = ({ field, form, ...props }) => (
  <InputMask
    mask="999.999.999-99"
    value={field.value}
    onChange={field.onChange}
    onBlur={field.onBlur}
    id={field.name}
    name={field.name}
    {...props}
  >
    {(inputProps) => <input {...inputProps} />}
  </InputMask>
);

const Signup = ({ onSignup }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (values, { setSubmitting }) => {
    try {
      setGeneralError('');
      
      // Aqui você pode adicionar a lógica de cadastro
      console.log('Dados do cadastro:', values);
      
      // Se onSignup for fornecido, use-o
      if (onSignup) {
        onSignup(values);
      } else {
        // Caso contrário, apenas simule um cadastro bem-sucedido
        setTimeout(() => {
          alert('Cadastro realizado com sucesso!');
          navigate('/login');
        }, 1000);
      }
    } catch (error) {
      setGeneralError('Erro ao realizar cadastro. Tente novamente.');
      console.error('Signup error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="signup-container">
      <h2>Criar Conta</h2>
      {generalError && <div className="error-message">{generalError}</div>}
      
      <Formik
        initialValues={{
          name: '',
          email: '',
          cpf: '',
          password: '',
          confirmPassword: ''
        }}
        validationSchema={SignupSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, touched, errors }) => (
          <Form className="signup-form">
            <div className="input-group">
              <label htmlFor="name">Nome Completo</label>
              <div className={`input-wrapper ${touched.name && errors.name ? 'error' : ''}`}>
                <FaUser className="input-icon" />
                <Field
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Seu nome completo"
                  autoComplete="name"
                  aria-required="true"
                />
              </div>
              <ErrorMessage name="name" component="div" className="field-error" />
            </div>

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
              <label htmlFor="cpf">CPF</label>
              <div className={`input-wrapper ${touched.cpf && errors.cpf ? 'error' : ''}`}>
                <FaIdCard className="input-icon" />
                <Field
                  name="cpf"
                  component={CPFMaskField}
                  placeholder="000.000.000-00"
                  autoComplete="off"
                  aria-required="true"
                />
              </div>
              <ErrorMessage name="cpf" component="div" className="field-error" />
            </div>

            <div className="input-group">
              <label htmlFor="password">Senha</label>
              <div className={`input-wrapper ${touched.password && errors.password ? 'error' : ''}`}>
                <FaLock className="input-icon" />
                <Field
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Crie uma senha"
                  autoComplete="new-password"
                  aria-required="true"
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => togglePasswordVisibility('password')}
                  aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <ErrorMessage name="password" component="div" className="field-error" />
              <div className="password-hint">
                A senha deve conter pelo menos 6 caracteres, incluindo uma letra maiúscula, uma minúscula e um número.
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <div className={`input-wrapper ${touched.confirmPassword && errors.confirmPassword ? 'error' : ''}`}>
                <FaLock className="input-icon" />
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirme sua senha"
                  autoComplete="new-password"
                  aria-required="true"
                />
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  aria-label={showConfirmPassword ? 'Esconder senha' : 'Mostrar senha'}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <ErrorMessage name="confirmPassword" component="div" className="field-error" />
            </div>
            
            <button 
              type="submit" 
              className="signup-button" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
            </button>
            
            <div className="login-link">
              Já tem uma conta? <Link to="/login">Faça login</Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Signup;
