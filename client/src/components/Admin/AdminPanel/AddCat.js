import React, { useEffect, useState } from 'react'
import './AdminPanel.css'
import toast from 'react-hot-toast'
import { FaTrash } from "react-icons/fa";

export const AddCat = () => {
    const [mainCat, setMainCat] = useState('');
    const [selectedMainCat, setSelectedMainCat] = useState('');
    const [addSubCat, setAddSubCat] = useState('');
    const [data, setData] = useState([]);
    const [trigger, setTrigger] = useState(false);

    const handleMainCatAdd = async () => {
        const res = await fetch('http://localhost:3002/cat/addCat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mainCat
            })
        });

        const responseData = await res.json();

        if (res.status === 200) {
            toast.success(responseData.message)
            setMainCat('')
            setTrigger(!trigger)
        }
        else {
            toast.error(responseData.message)
        }
    }

    const handleSubCatAdd = async () => {
        const res = await fetch('http://localhost:3002/cat/addSubCat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                selectedMainCat,
                addSubCat
            })
        });

        if (res.status === 200) {
            toast.success(`${selectedMainCat} için ${addSubCat} alt kategorisi eklendi!`);
            setTrigger(!trigger);
            setSelectedMainCat('');
            setAddSubCat('');
        }
    }

    const handleSubCatDelete = async (mainCat, subCatName) => {
        const res = await fetch('http://localhost:3002/cat/delSubCat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mainCat,
                subCat : subCatName
            })
        });

        if (res.status === 200) {
            toast.success(`${mainCat} kategorisinden ${subCatName} alt kategorisi silindi!`);
            setTrigger(!trigger);
        } else {
            const responseData = await res.json();
            toast.error(responseData.message);
        }
    }

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:3002/cat/getCat', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                const result = await res.json();
                if (isMounted) {
                    setData(result.data || []);
                }
            } catch (error) {
                console.error('Veriler alınırken bir hata oluştu:', error);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [trigger]);

    return (
        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3 className="modal-title" id="staticBackdropLabel">Kategori Ekleme</h3>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <h5>Ana Kategori</h5>
                        <div className='row'>
                            <div className='col-10'>
                                <div className="form-floating mt-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="floatingInput"
                                        placeholder="Eklemek istediğiniz ana kategori"
                                        value={mainCat}
                                        onChange={(e) => setMainCat(e.target.value)}
                                    />
                                    <label htmlFor="floatingInput">Eklemek istediğiniz ana kategori</label>
                                </div>
                            </div>
                            <div className='col button-area'>
                                <button type="button" className="btn btn-success add-button" onClick={handleMainCatAdd}>Ekle</button>
                            </div>
                        </div>

                        <hr />

                        <h5>Alt Kategori</h5>

                        {Array.isArray(data) && data.map((cat, index) => (
                            <div key={index} className='container-sm cat-area'>
                                <h6>{cat.name}</h6>
                                {Array.isArray(cat.subCats) && cat.subCats.map((subCat, subIndex) => (
                                    <div key={subIndex} className='sub-cat-item'>
                                        <pre>   {subCat.name} <FaTrash className='subcat-del-icon' onClick={() => handleSubCatDelete(cat.name, subCat.name)} /></pre>
                                    </div>
                                ))}
                                <div className='add-subcat-input-area'>
                                    <input
                                        type="text"
                                        className="form-control mt-2 add-subcat-input"
                                        placeholder={`${cat.name} için alt kategori ekleyin`}
                                        onChange={(e) => {
                                            setSelectedMainCat(cat.name);
                                            setAddSubCat(e.target.value);
                                        }}
                                        value={selectedMainCat === cat.name ? addSubCat : ''}
                                    />
                                    <button className='btn btn-success mt-2' onClick={handleSubCatAdd}>Alt kategori ekle</button>
                                </div>
                            </div>
                        ))}

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
