import { useState } from "react"

function Form() {
    const [company, setCompany] = useState('');
    const [partnerCount, setPartnerCount] = useState();
    const [partnerShares, setPartnerShares] = useState([]);

    const [productDetails, setProductDetails] = useState([]);
    const [profitLoss, setProfitLoss] = useState(0);
    const [partnerprofitLoss, setPartnerProfitLoss] = useState([]);

    const handlePartnerCountChange = (e) => {
        const count = parseInt(e.target.value);
        setPartnerCount(count);
        setPartnerShares(Array(count).fill())
    } // Idhar se Number of Partners milega
    
    const handlePartnerShares = (index, e) => {
        const updatedPartnerShare = [...partnerShares];
        updatedPartnerShare[index] = e.target.value;
        setPartnerShares(updatedPartnerShare);
    }; // Idhar se Partners ke Shares milenge

    const FieldPartnerShares = () => {
        return partnerShares.map((share, index) => (
            <div className="partner-input" key={index}>
                <label htmlFor="shares">Partner {index+1} Shares (in %) </label>
                <input type="number" name="shares" value={share} onChange={(event) => handlePartnerShares(index, event)} />
            </div>
        ))
    } // Idhar se Partner ke Shares ka input milega user se

    const handleProductDetails = (e) => {
        e.preventDefault();
        
        const product = {
            name: e.target.productName.value,
            cost: parseFloat(e.target.productCost.value),
            sellingPrice: parseFloat(e.target.sellingPrice.value),
            quantitySold: parseInt(e.target.quantitySold.value)
        };
        setProductDetails([...productDetails, product]);

        const totalCost = product.cost * product.quantitySold;
        const totalRevenue = product.sellingPrice * product.quantitySold;
        const profitLossValue = totalRevenue - totalCost;
        setProfitLoss(profitLoss + profitLossValue);

        const distribution = partnerShares.map((share) => ({
            partnerShare: share,
            partnerDistribution: (profitLossValue * share) / 100
        }));
        setPartnerProfitLoss([...partnerprofitLoss, distribution]);

        e.target.reset(); //  Taaki naya Item add kr sake
    } // Idhar se product ki details milenge
 
    const displayProductDetails = () => {
        return productDetails.map((product, index) => (
            <tr key={index}>
                <td>{product.name}</td>
                <td>{product.cost}</td>
                <td>{product.sellingPrice}</td>
                <td>{product.quantitySold}</td>
            </tr>
        ));
    }; //  Table form me product ka data

    const displayPartnerProfitLoss = () => {
        return partnerprofitLoss.map((distribution, index) => (
            <tr key={index}>
                {distribution.map((partnerDist, index) => (
                    <td key={index}>{partnerDist.partnerDistribution}</td>
                ))}
            </tr>
        ));
    }; // Table form me partner ke loss/profit unke shares ke hisaab se

    // const submit = () => {
    //     console.log(profitLoss);
    // } // Testing Purpose

    return (
        <div className="main">
            <h2>Company Details</h2>
            <input type="text" name="name" placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} />
            <input type="number" name="partnerCount" placeholder="Number of Partners" value={partnerCount} onChange={handlePartnerCountChange} />
            {/* <button onClick={submit}>Click Me!</button>  // Testing Purpose */} 
            <br />
            <div className="test">{FieldPartnerShares()}</div>

            <form onSubmit={handleProductDetails}>
                <h2>Product Details</h2>
                <label htmlFor="productName">Product Name:</label>
                <input type="text" id="productName" required />

                <label htmlFor="productCost">Product Cost:</label>
                <input type="number" id="productCost" min="0" step="0.01" required />

                <label htmlFor="sellingPrice">Selling Price:</label>
                <input type="number" id="sellingPrice" min="0" step="0.01" required />

                <label htmlFor="quantitySold">Quantity Sold:</label>
                <input type="number" id="quantitySold" min="0" required />

                <button type="submit">Add Product</button>
            </form>

            {productDetails.length > 0 && (
                <div>
                    <h2>Product Details</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Cost</th>
                                <th>Selling Price</th>
                                <th>Quantity Sold</th>
                            </tr>
                        </thead>
                        <tbody>{displayProductDetails()}</tbody>
                    </table>
                </div>
            )}

            {profitLoss !== 0 && (
                <div>
                    <h2>Total Profit/Loss: {profitLoss}</h2>
                    <table>
                        <tr>
                            {partnerShares.map((_, index) => (
                                <th key={index}>{`Partner ${index + 1}`}</th>
                            ))}
                        </tr>
                        <tbody>{displayPartnerProfitLoss()}</tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default Form