import React, { useEffect, useState } from 'react';
import './ApplySeller.css';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router';
import toast from 'react-hot-toast';

export const ApplySeller = () => {

    const { pathname } = useLocation();
    const [compEmail, setEmail] = useState('');
    const [compName, setName] = useState('');

    const handleApply = async (event) => {
        event.preventDefault();
        console.log(`Şirket adı : ${compName} Şirket e-maili : ${compEmail}`);

        const res = await fetch('http://localhost:3002/seller/createReq', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                compEmail,
                compName
            })
        });

        const data = await res.json();

        if(res.status == 200){
            toast.success(data.message);
        }

    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <motion.div
            className="container cs-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="cs-area row">
                <div className="image-area col-6">
                    <img style={{maxWidth:'30rem'}}src="https://res.cloudinary.com/dbofmdmkp/image/upload/webs-img/apply-seller.jpg " class="img-fluid" alt="..." />
                </div>
                <div className="col">
                    <div className="row">
                        <div className="col">
                            <h5>Satış Başvurusu</h5>
                            <p className='cs-info'>
                                İşletmenizi bizimle büyütmek ister misiniz? E-ticaret platformumuzda yer almak ve ürünlerinizi geniş bir müşteri kitlesine ulaştırmak için işyeri başvurunuzu hemen yapın. Başvurunuzun onaylanmasının ardından, siz de satışa başlayabilir, işletmenizi dijital dünyada bir adım öne taşıyabilirsiniz. Başvurunuzu aşağıdan yapabilirsiniz! Başvurunuz onaya gönderilecektir. Onaylanmasının ardından parolanızı belirleyerek satış yapmaya başlayabilirsiniz.
                            </p>
                            <hr />
                            <form className='apply-form' onSubmit={handleApply}>
                                <div class="form-floating mb-3">
                                    <input type="text" class="form-control apply-input" id="floatingInput" placeholder="name@example.com" onChange={e => setName(e.target.value)} />
                                    <label for="floatingInput">Şirket Adı</label>
                                </div>
                                <div class="form-floating mb-3">
                                    <input type="email" class="form-control apply-input" id="floatingInput" placeholder="Password" onChange={e => setEmail(e.target.value)} />
                                    <label for="floatingPassword">Şirket e-maili</label>
                                </div>
                                <div className='apply-button-wrapper'>
                                    <button type="submit" className="btn btn-secondary apply-button">Başvur</button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>

            </div>
        </motion.div>
    );
};
