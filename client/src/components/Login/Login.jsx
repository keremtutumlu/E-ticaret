import React, { useEffect, useState } from 'react';
import './Login.css';
import { motion, LayoutGroup } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginStore } from '../../store/auth';
import { toast } from 'react-hot-toast';

export const Login = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();

    const res = await fetch('http://localhost:3002/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await res.json();

    if (data.user) {
      dispatch(loginStore(data.user));

      toast.success('Giriş yapılıyor...');
      navigate('/');
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    if (searchParams.get('stat') === 'true') {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [searchParams]);

  const handleRegister = async (event) => {
    event.preventDefault();

    const res = await fetch('http://localhost:3002/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        email,
        password
      })
    });

    const data = await res.json();

    if (data.user) {
      dispatch(loginStore(data.user));
      toast.success('Kayıt tamamlandı giriş yapılıyor...');
      navigate('/');
    }
  };

  return (
    <motion.div 
      className='container login'
      initial={{opacity:0}}
      animate={{opacity:1}}    
    >
      <LayoutGroup>
        <nav className='btn-group'>
          <ul className='ul-group'>
            <motion.li
              layout
              animate={{ fontSize: isLogin ? "1.5rem" : "1rem" }}
              className={`ul-group-items ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Giriş Yap
              {isLogin && (
                <motion.div
                  style={{ fontSize: "x-large" }}
                  layoutId="underline"
                  className="underline"
                />
              )}
            </motion.li>
            <motion.li
              layout
              animate={{ fontSize: !isLogin ? "1.5rem" : "1rem" }}
              className={`ul-group-items ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Kaydol
              {!isLogin && (
                <motion.div
                  style={{ fontSize: "x-large" }}
                  layoutId="underline"
                  className="underline"
                />
              )}
            </motion.li>
          </ul>
        </nav>

        <motion.div
          layout
          className='rotating-div'
          style={{ height: "35rem" }}
          transition={{ layout: { duration: 0.5, ease: "easeInOut" } }}
        >
          {isLogin ? (
            <motion.form
              layout
              className='form'
              onSubmit={handleLogin}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              <hr />
              <div className='mb-3'>
                <label htmlFor="exampleFormControlInput1" className="form-label">Email</label>
                <input type="email" className="form-control" id="exampleFormControlInput1" onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className='mb-4'>
                <label htmlFor="inputPassword5" className="form-label">Parola</label>
                <input type="password" id="inputPassword5" className="form-control" aria-describedby="passwordHelpBlock" onChange={e => setPassword(e.target.value)} required />
                <div id="passwordHelpBlock" className="form-text"></div>
              </div>
              <div className="mb-2" id='remember-me'>
                <label><input type='checkbox' /> Beni hatırla </label>
                <Link to='/forgot-password' className='form-link'>Parolanı mı unuttun?</Link>
              </div>
              <button type="submit" className="btn btn-secondary btn-m">Giriş yap</button>
              <div className="mb mt-3" id='register-link'>
                <label>Henüz hesabın yok mu? <Link className='register' onClick={() => setIsLogin(false)} className='form-link'>Kaydol</Link></label>
              </div>
              <div className="mb mt-3" id='seller-login'>
                <label>Satıcı girişi mi yapmak istiyorsun ?</label> <Link to='/sellerLogin' className='form-link'>Satıcı olarak giriş yap</Link>
              </div>
            </motion.form>
          ) : (
            <motion.form
              layout
              className='form'
              onSubmit={handleRegister}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              <hr />
              <div className="mb-3">
                <label htmlFor="exampleFormControlInput1" className="form-label">Kullanıcı adı</label>
                <input type="text" className="form-control" id="exampleFormControlInput1" onChange={e => setUsername(e.target.value)} value={username} required />
              </div>
              <div className='mb-3'>
                <label htmlFor="exampleFormControlInput1" className="form-label">Email</label>
                <input type="email" className="form-control" id="exampleFormControlInput2" onChange={e => setEmail(e.target.value)} value={email} required />
              </div>
              <div className='mb-4'>
                <label htmlFor="inputPassword5" className="form-label">Parola</label>
                <input type="password" id="inputPassword5" className="form-control" aria-describedby="passwordHelpBlock" onChange={e => setPassword(e.target.value)} value={password} required />
                <div id="passwordHelpBlock" className="form-text">
                  Parolanız en az 6 karakter uzunluğunda olmalıdır.
                </div>
              </div>
              <button type="submit" className="btn btn-secondary btn-m">Kayıt ol</button>
              <div className="mb mt-3" id='register-link'>
                <label>Zaten hesabın var mı? <Link className='register' onClick={() => setIsLogin(true)}>Giriş yap</Link></label>
              </div>
            </motion.form>
          )}
        </motion.div>
      </LayoutGroup>
    </motion.div>
  );
};
