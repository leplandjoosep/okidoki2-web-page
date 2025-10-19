import React from 'react';
import axios from "axios";
import '../css/Store.css';

const api = axios.create({
    baseURL: "http://okidoki2.hopto.org/api"
})

class StorePage extends React.Component {
    state = {
        products: [],
        selectedProduct: null,
        loading: true // Add loading state
    }

    constructor() {
        super();
        this.getProducts();
    }

    async componentDidMount() {
        await this.getProducts();
    }

    getProducts = async () => {
        try {
            let data = await api.get("/public/products").then(({ data }) => data);
            for (let product of data) {
                product.pictureString = await this.getPicture(product.pictureId);
                const ownerId = product.ownerId
                const owner = await api.get(`/public/user/${ownerId}`)
                product.ownerFirstName = owner.data.firstName
                product.ownerLastName = owner.data.lastName
                product.ownerEmail = owner.data.email
            }
            this.setState({ products: data, loading: false }); // Set loading to false when done
        } catch (e) {
            console.error('Error retrieving data.');
            this.setState({ loading: false }); // Ensure loading is set to false in case of error
        }
    }

    getPicture = async (id) => {
        try {
            const pictureData = await api.get(`/public/picture/${id}`)
            return pictureData.data.pictureString;
        }
        catch {
            console.error('Error getting picture')
        }
    }

    selectProduct = (product) => {
        this.setState({ selectedProduct: product });
    }

    renderModal = () => {
        const { selectedProduct } = this.state;
        if (!selectedProduct) return null;

        const sellerName = `${selectedProduct.ownerFirstName} ${selectedProduct.ownerLastName}`;

        return (
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={() => this.setState({ selectedProduct: null })}>&times;</span>
                    {selectedProduct.pictureString && <img src={`data:image/jpeg;base64,${selectedProduct.pictureString}`} alt={selectedProduct.name} />}
                    <h2>{selectedProduct.name}</h2>
                    <p>{selectedProduct.description}</p>
                    <p><strong>Price:</strong> {selectedProduct.price}</p>
                    <p><strong>Seller Name:</strong> {sellerName}</p>
                    <p><strong>Seller Email:</strong> {selectedProduct.ownerEmail}</p>
                </div>
            </div>
        );
    }


    render() {
        const { loading, products, selectedProduct } = this.state;
        return (
            <div>
                {loading ? (
                    <div className="loader">Loading...</div>
                ) : (
                    <div className="product-grid">
                        {products.map((product, index) => (
                            <div
                                className="product-card"
                                key={product.id}
                                onClick={() => this.selectProduct(product)}
                                style={{ animationDelay: `${index * 0.1}s` }} // 0.1s delay for each product
                            >
                                {product.pictureString && (
                                    <img src={`data:image/jpeg;base64,${product.pictureString}`} alt={product.name} />
                                )}
                                <h2>{product.name}</h2>
                                <p><strong>Price:</strong> {product.price}</p>
                            </div>
                        ))}
                    </div>
                )}
                {selectedProduct && this.renderModal()}
            </div>
        );
    }
}

export default StorePage;
