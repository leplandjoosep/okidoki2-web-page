import React, { useState } from 'react';
import '../css/Form.css';
import '../css/App.css';
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AddProductForm = () => {
    const api = axios.create({
        baseURL: "http://okidoki2.hopto.org/api"
        // baseURL: "http://localhost:8080/api"
        // baseURL: "http://127.0.0.1:8080/api"
    })
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productImage, setProductImage] = useState(null);
    const [productPrice, setProductPrice] = useState('');
    const [productNameError, setProductNameError] = useState('');
    const [productDescriptionError, setProductDescriptionError] = useState('');
    const [productImageError, setProductImageError] = useState('');
    const [productPriceError, setProductPriceError] = useState('');


    const handleProductNameChange = (e) => {
        setProductName(e.target.value);
        if (e.target.value.trim()) {
            setProductNameError('');
        }
    };

    const handleProductDescriptionChange = (e) => {
        setProductDescription(e.target.value);
        if (e.target.value.trim()) {
            setProductDescriptionError('');
        }
    };

    const handleProductImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                setProductImage(base64String);
                setProductImageError('');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProductPriceChange = (e) => {
        setProductPrice(e.target.value);
        if (e.target.value.trim()) {
            setProductPriceError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;

        setProductNameError('');
        setProductDescriptionError('');
        setProductImageError('');
        setProductPriceError('');

        if (!productName.trim()) {
            setProductNameError("Please enter a product name.");
            isValid = false;
        }
        if (!productDescription.trim()) {
            setProductDescriptionError("Please enter a product description.");
            isValid = false;
        }
        if (!productImage) {
            setProductImageError("Please upload a product image.");
            isValid = false;
        }
        if (!productPrice.trim()) {
            setProductPriceError("Please enter a product price.");
            isValid = false;
        }

        if (isValid) {

            try {

                if (!productName.trim()) {
                    alert("Please enter a product name.");
                    return;
                }
                if (!productDescription.trim()) {
                    alert("Please enter a product description.");
                    return;
                }
                if (!productImage) {
                    alert("Please upload a product image.");
                    return;
                }
                if (!productPrice.trim()) {
                    alert("Please enter a product price.");
                    return;
                }

                const formData = new FormData();
                formData.append('picture', productImage);
                const pictureResponse = await api.post('/public/picture', {
                    pictureString: productImage
                });

                if (pictureResponse.status === 200) {
                    const pictureID = pictureResponse.data.id;

                    //
                    const authToken = localStorage.getItem('token');
                    const decodedToken = jwtDecode(authToken);
                    const ownerID = decodedToken.id;

                    await api.post('/public/product', {
                        description: productDescription,
                        name: productName,
                        ownerId: ownerID,
                        pictureId: pictureID,
                        price: productPrice
                    });
                    window.location.reload();
                }
            } catch (error) {
                console.error('Upload fail:', error);
            }
        }
    };

    return (
        <div className="formContainer">
            <form onSubmit={handleSubmit}>
                <div className="titleContainer">
                    <div>Uus kuulutus</div>
                </div>
                <div className="form-group">
                    <label htmlFor="productName">Pealkiri</label>
                    <input
                        type="text"
                        id="productName"
                        value={productName}
                        onChange={handleProductNameChange}
                        maxLength="50"
                    />
                    {productNameError && <p style={{ color: "red" }}>{productNameError}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="productDescription">Kirjeldus eesti keeles</label>
                    <textarea
                        id="productDescription"
                        value={productDescription}
                        onChange={handleProductDescriptionChange}
                        maxLength="500"
                    />
                    {productDescriptionError && <p style={{ color: "red" }}>{productDescriptionError}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="productImage">Lisa pilt</label>
                    <input
                        type="file"
                        id="productImage"
                        onChange={handleProductImageChange}
                        accept="image/*"
                    />
                    {productImageError && <p style={{ color: "red" }}>{productImageError}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="productPrice">Hind</label>
                    <input
                        type="text"
                        id="productPrice"
                        value={productPrice}
                        onChange={handleProductPriceChange}
                    />
                    {productPriceError && <p style={{ color: "red" }}>{productPriceError}</p>}
                </div>
                <button type="submit" className="submitButton">Lisa kuulutus</button>
            </form>
        </div>
    );
};

export default AddProductForm;
