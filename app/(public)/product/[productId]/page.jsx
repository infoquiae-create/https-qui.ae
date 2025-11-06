'use client'
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import ProductCard from "@/components/ProductCard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Product() {

    const { productId } = useParams();
    const [product, setProduct] = useState();
    const [relatedProducts, setRelatedProducts] = useState([]);
    const products = useSelector(state => state.product.list);

    const fetchProduct = async () => {
        const product = products.find((product) => product.id === productId);
        setProduct(product);
        
        // Get related products from same category
        if (product) {
            const related = products
                .filter(p => p.id !== productId && p.category === product.category && p.inStock)
                .slice(0, 5);
            setRelatedProducts(related);
        }
    }

    useEffect(() => {
        if (products.length > 0) {
            fetchProduct()
        }
        scrollTo(0, 0)
    }, [productId,products]);

    return (
        <div className="lg:mx-6">
            <div className="max-w-7xl mx-auto pb-24 lg:pb-0">

                {/* Product Details */}
                {product && (<ProductDetails product={product} />)}

                {/* Description & Reviews */}
                {product && (<ProductDescription product={product} />)}

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="px-4 mt-12 mb-16">
                        <h2 className="text-2xl font-semibold text-slate-800 mb-6">Related Products</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 gap-6">
                            {relatedProducts.map((prod) => (
                                <ProductCard key={prod.id} product={prod} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}