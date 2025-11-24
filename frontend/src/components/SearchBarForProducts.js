import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function SearchBarForProducts() {
    const history = useHistory();
    const [searchTerm, setSearchTerm] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        if (searchTerm) {
            // Redirect to products page with search query parameter
            history.push(`/products?search=${searchTerm.toLowerCase()}`);
        } else {
            // If search term is empty, just go to products page
            history.push('/products');
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <form onSubmit={onSubmit}>
                <span style={{ display: "flex", alignItems: "center" }}>
                    <input
                        type="text"
                        value={searchTerm}
                        placeholder="Search products..."
                        className="form-control"
                        style={{
                            flex: 1,
                            padding: "12px 15px",
                            fontSize: "1rem",
                            borderRadius: "8px 0 0 8px",
                            border: "1px solid #ccc",
                            borderRight: "none",
                            minWidth: "300px"
                        }}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            padding: "12px 20px",
                            borderRadius: "0 8px 8px 0",
                            border: "1px solid #007bff"
                        }}
                    >
                        <i className="fas fa-search"></i>
                    </button>
                </span>
            </form>
        </div>
    );
}

export default SearchBarForProducts;
