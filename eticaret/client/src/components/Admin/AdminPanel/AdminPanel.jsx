import React, { useEffect, useState } from 'react';
import './AdminPanel.css';
import { AddCat } from './AddCat.js';

export const AdminPanel = () => {

    return (
        <div className='container admin-panel'>
            <div className="admin-panel-header">
                <h2 className='panel-header'>İşlemler</h2>
            </div>
            <button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                Kategori Ekle
            </button>

            <AddCat/>

            
        </div>
    );
};
