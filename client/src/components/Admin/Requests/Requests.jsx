import React, { useEffect, useState } from 'react'
import './Requests.css'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

export const Requests = () => {
    const [selectedId, setSelectedId] = useState(null);
    const [reqs, setReqs] = useState([]);


    const acceptHandle = async (compEmail, compName) => {
        try {

            const res = await fetch('http://localhost:3002/mail/sendAcceptMail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    compEmail,
                    compName
                })
            });


            if(res.status === 200){
                toast.success('Kabul edildi.');
                reqs.pop(selectedId);
                setSelectedId(null);
            }else{
                const data = res.json() 
                toast.error(data.message);
            }

        } catch (error) {
            toast.warn(error);
        }
    }


    const rejectHandle = async (compEmail, compName) => {
        try {

            const res = await fetch('http://localhost:3002/mail/sendRejectMail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    compEmail,
                    compName
                })
            });

            toast.success('Reddedildi!');
            reqs.pop(selectedId);
            setSelectedId(null);

        } catch (error) {
            toast.warn(error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('http://localhost:3002/seller/getCreateSellerReq', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await res.json();
            setReqs(data.data);
        };

        fetchData();
    }, [], [reqs]);

    return (
            <motion.div
                className='container req-screen-cont'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="row">
                    <div className="col-6">
                        <div className="seller-req">
                            <h2>Satıcı İstekleri</h2>
                            {reqs.length === 0 ?
                                (
                                    <>
                                        <motion.div
                                            className='empty-req-area'
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1, duration: 5 }}
                                        >
                                            Görüntülenecek istek kalmadı!
                                        </motion.div>
                                    </>
                                )
                                :
                                (
                                    reqs.map(item => (
                                        <motion.div
                                            className='req-list-items'
                                            key={item.compName}
                                            layoutId={item.compName}
                                            onClick={() => setSelectedId(item.compName)}
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            whileHover={{
                                                scale: 1.1,
                                                boxShadow: '5px 5px 5px 5px rgba(0, 0, 0, 0.1)'
                                            }}
                                            whileTap={{
                                                scale: 1.3
                                            }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <motion.h5>{item.compName} tarafından istek</motion.h5>
                                        </motion.div>
                                    ))
                                )

                            }
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="customer-req">
                            <h2>Kullanıcı İstekleri</h2>
                            <motion.div
                                className='empty-req-area'
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                Görüntülenecek istek kalmadı!
                            </motion.div>
                        </div>
                    </div>
                </div>
                <AnimatePresence>
                    {selectedId && (
                        <motion.div
                            className="modal show d-block"
                            layoutId={selectedId}
                            key={selectedId}
                            initial={{ opacity: 0, scale: 2 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    {reqs.find(item => item.compName === selectedId) && (
                                        <>
                                            <div className="modal-header">
                                                <h5 className="modal-title">{reqs.find(item => item.compName === selectedId).compName} Şirketi</h5>
                                                <button
                                                    type="button"
                                                    className="btn-close"
                                                    onClick={() => setSelectedId(null)}
                                                    aria-label="Close"
                                                ></button>
                                            </div>
                                            <div className="modal-body">
                                                <p>Mail : {reqs.find(item => item.compName === selectedId).compEmail}</p>
                                            </div>
                                        </>
                                    )}
                                    <div className="modal-footer">

                                        <button type="button" className="btn btn-success" onClick={() => acceptHandle(reqs.find(item => item.compName === selectedId).compEmail, reqs.find(item => item.compName === selectedId).compName)}>Kabul Et</button>
                                        <button type="button" className="btn btn-danger" onClick={() => rejectHandle(reqs.find(item => item.compName === selectedId).compEmail, reqs.find(item => item.compName === selectedId).compName)}>Reddet</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
    );
}
