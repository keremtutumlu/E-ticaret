import React, { useEffect, useState } from 'react';
import './Login.css';
import { motion, Group } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { sellerLoginStore } from '../../store/auth';
import { toast } from 'react-hot-toast';

export const SellerLogin = () => {

    const [compName, setCompName] = useState('');
    const [compEmail, setCompEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (event) => {
        event.preventDefault();

        const res = await fetch('http://localhost:3002/seller/sellerLogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                compEmail,
                password
            })
        });

        const data = await res.json();

        if (data.comp) {
            dispatch(sellerLoginStore(data.comp));
            toast.success('Satıcı girişi yapılıyor...');
            navigate('/');
        }
        else{
            toast.error(data.message);
            console.log(data.data);
        }
    };

    return (
        <motion.div
            className='container login'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.div
                animate={{ fontSize: "1.5rem" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{marginTop: "2rem"}}
            >
                Satıcı Girişi
            </motion.div>
            <motion.div
                className='rotating-div'
                style={{ height: "35rem" }}
            >
                <motion.form  
                    className='form'
                    onSubmit={handleLogin}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.5 }}
                >
                    <hr />
                    <div className='mb-3'>
                        <label htmlFor="exampleFormControlInput1" className="form-label">Şirket Maili</label>
                        <input type="compEmail" className="form-control" id="exampleFormControlInput1" onChange={e => setCompEmail(e.target.value)} required />
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
                        <label>Henüz satıcı hesabın yok mu? <Link className='register' to='/createSeller' className='form-link'>İstek gönder</Link></label>
                    </div>
                    <div className="mb mt-3" id='seller-login'>
                        <label>Kullanıcı girişi mi yapmak istiyorsun ?</label> <Link to='/login?stat=true' className='form-link'>Kullanıcı olarak giriş yap</Link>
                    </div>
                </motion.form>

            </motion.div>
        </motion.div>
    );
};
