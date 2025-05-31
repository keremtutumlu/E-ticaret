import React, { useEffect, useState } from 'react'
import './SellerHome.css'
import { useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { IoMdStarOutline, IoMdStar, IoMdStarHalf } from "react-icons/io";

export const SellerHome = () => {

    const [searchParams] = useSearchParams()
    const sellerName = searchParams.get('selNa');
    const [seller, setSeller] = useState();

    const renderStars = (average) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= average) {
                stars.push(<IoMdStar key={i} style={{ color: "rgb(255, 192, 0)" }} />);
            } else if (i - 0.5 <= average) {
                stars.push(<IoMdStarHalf key={i} />);
            } else {
                stars.push(<IoMdStarOutline key={i} />);
            }
        }
        return stars;
    }

    const getSellerData = async () => {
        const res = await fetch('http://localhost:3002/seller/getSellerData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sellerName
            })
        });

        const data = await res.json()

        if (res.status == 200) {
            setSeller(data.data)
        }

    }

    useEffect(() => {

        if (sellerName) {
            getSellerData();
        }

        console.log(seller);


    }, [sellerName])

    return (
        <div className='container seller-home mt-4'>
            <div className='seller-header'>
                <h3>{seller?.compName}</h3>
            </div>
            <div className='seller-info'>
                <div className='seller-address'>
                    {seller.compAddress && seller.compAddress.map((address, index) => (
                        <div key={index} className='seller-address-p'>
                            <h6>Adres : </h6>Ülke: {address.country} İl: {address.city} İlçe: {address.district}
                        </div>
                    ))}
                </div>

                <div className="seller-rating">
                Ortalama Puan : {renderStars(seller.averageRating)}
                </div>

            </div>
        </div>
    )
}
