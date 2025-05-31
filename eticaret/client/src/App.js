import { Route, Routes } from 'react-router';
import './App.css';
import { Provider } from 'react-redux';
import { Home } from './components/Home/Home';
import { Login } from './components/Login/Login';
import { Header } from './components/Header/Header';
import store from './store';
import { Toaster } from 'react-hot-toast';
import { AccountSet } from './components/AccountSet/AccountSet';
import { Footer } from './components/Footer/Footer';
import { ApplySeller } from './components/ApplySeller/ApplySeller';
import { Requests } from './components/Admin/Requests/Requests';
import { SellerRegister } from './components/SellerRegister/SellerRegister.jsx';
import { SellerLogin } from './components/Login/SellerLogin.jsx';
import { SellerDashboard } from './components/Seller/SellerDashboard/SellerDashboard.jsx';
import { AdminPanel } from './components/Admin/AdminPanel/AdminPanel.jsx';
import { ProdDetails } from './components/ProdDetails/ProdDetails.jsx';
import { Cart } from './components/Cart/Cart.jsx';
import { Favorites } from './components/Favorites/Favorites.jsx';
import { Orders } from './components/Orders/Orders.jsx';
import { SellerHome } from './components/Seller/SellerHome/SellerHome.jsx';


function App() {
  return (
    <div className="main">
      <Toaster />
      <Provider store={store}>
        <Header />
        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/accountSet' element={<AccountSet />} />
          <Route path='/createSeller' element={<ApplySeller />} />
          <Route path='/requests' element={<Requests />} />
          <Route path='/sellerRegister' element={<SellerRegister />} />
          <Route path='/sellerLogin' element={<SellerLogin />} />
          <Route path='/sellerDashboard' element={<SellerDashboard />} />
          <Route path='/adminPanel' element={<AdminPanel />} />
          <Route path='/prodDetails' element={<ProdDetails />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/favorites' element={<Favorites />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/sellerHome' element={<SellerHome />} />
        </Routes>
        <Footer />
      </Provider>
    </div>
  );
}

export default App;
