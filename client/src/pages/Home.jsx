import React, { useState } from 'react';
import ChatModal from '../components/ChatModal';
import '../styles/Home.css';

const Home = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const products = [
    {
      id: 1,
      name: '苹果 MacBook Pro 13",'
      price: 4500,
      seller: '学长',
      condition: '八成新',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300',
      views: 1234,
      likes: 89
    },
    {
      id: 2,
      name: '自行车 - 女生款',
      price: 380,
      seller: '学妹',
      condition: '全新',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300',
      views: 567,
      likes: 45
    },
    {
      id: 3,
      name: '吉他 - 民谣木吉他',
      price: 650,
      seller: '音乐社',
      condition: '九成新',
      image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=300',
      views: 892,
      likes: 76
    },
    {
      id: 4,
      name: '英语考试书籍套装',
      price: 120,
      seller: '图书馆',
      condition: '全新',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300',
      views: 2100,
      likes: 234
    },
    {
      id: 5,
      name: '宿舍小冰箱',
      price: 280,
      seller: '大四学长',
      condition: '八成新',
      image: 'https://images.unsplash.com/photo-1584568694244-14fbbc50d158?w=300',
      views: 456,
      likes: 52
    },
    {
      id: 6,
      name: '无线蓝牙耳机',
      price: 180,
      seller: '电子市集',
      condition: '全新',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
      views: 1567,
      likes: 143
    }
  ];

  const handleContactSeller = (product) => {
    setSelectedProduct(product);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setSelectedProduct(null);
  };

  return (
    <div className="home-page">
      <header className="header">
        <div className="header-top">
          <h1>校园二手市场</h1>
          <div className="header-actions">
            <input type="text" placeholder="搜索商品..." className="search-input" />
            <button className="post-btn">发布商品</button>
          </div>
        </div>
      </header>

      <nav className="category-nav">
        <a href="#" className="category-tab active">全部</a>
        <a href="#" className="category-tab">电子产品</a>
        <a href="#" className="category-tab">图书</a>
        <a href="#" className="category-tab">生活用品</a>
        <a href="#" className="category-tab">运动户外</a>
      </nav>

      <main className="main-content">
        <section className="recommended-section">
          <h2>热门推荐</h2>
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <span className="condition-badge">{product.condition}</span>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">¥{product.price}</p>
                  <div className="seller-section">
                    <span className="seller-name">🧑 {product.seller}</span>
                    <span className="stats">
                      👁 {product.views} · ♡ {product.likes}
                    </span>
                  </div>
                  <button 
                    className="contact-btn"
                    onClick={() => handleContactSeller(product)}
                  >
                    联系商家
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {showChat && selectedProduct && (
        <ChatModal
          productId={selectedProduct.id}
          sellerName={selectedProduct.seller}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
};

export default Home;