import React, { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import LoginPage from './pages/login';
import ContactPage from './pages/contact';
import BookPage from './pages/book';
import { Outlet } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import RegisterPage from './pages/register';
import { callFetchAccount } from './services/api';
import { doGetAccountAction } from './redux/account/accountSlice';
import { useDispatch, useSelector } from 'react-redux';
import Loading from './components/Loading';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminPage from './pages/admin/index.jsx';
import LayoutAdmin from './components/Admin/LayoutAdmin.jsx';
import './styles/reset.scss';
import ManageUserPage from './pages/admin/user/index.jsx';
import ManageBookPage from './pages/admin/book/index.jsx';
import './styles/global.scss';
import OrderPage from './pages/order/index.jsx';
import HistoryPage from './pages/history/index.jsx';
import AdminOrderPage from './pages/admin/order/index.jsx';

const Layout = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className='layout-app'>
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <Outlet context={[searchTerm, setSearchTerm]} />
      <Footer />
    </div>
  )
}

// const LayoutAdmin = () => {
//   const isAdminRoute = window.location.pathname.startsWith('/admin');
//   const user = useSelector(state => state.account.user);
//   const userRole = user.role;

//   return (
//     <div className='layout-app'>
//       {isAdminRoute && userRole === 'ADMIN' && <Header />}
//       <Outlet />
//       {isAdminRoute && userRole === 'ADMIN' && <Footer />}
//     </div>
//   )
// }

export default function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.account.isAuthenticated)
  const isLoading = useSelector(state => state.account.isLoading)

  const getAccount = async () => {
    if (window.location.pathname === '/login' || window.location.pathname === '/register') return;
    const res = await callFetchAccount();
    if (res && res.data) {
      dispatch(doGetAccountAction(res.data.user))
    }
  }

  useEffect(() => {
    getAccount();
  }, [])


  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "contact",
          element: <ContactPage />,
        },
        {
          path: "book/:slug",
          element: <BookPage />,
        },
        {
          path: "order",
          element:
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>

        },
        {
          path: "history",
          element:
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
        }
      ],
    },
    {
      path: "admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound />,
      children: [
        {
          index: true, element:
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
        },
        {
          path: "user",
          element:
            <ProtectedRoute>
              <ManageUserPage />
            </ProtectedRoute>,
        },
        {
          path: "book",

          element:
            < ProtectedRoute >
              <ManageBookPage />,
            </ProtectedRoute >
        },
        {
          path: "order",
          element:
            <ProtectedRoute>
              <AdminOrderPage />,
            </ProtectedRoute>
        },
      ],
    },
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "register",
      element: <RegisterPage />,
    },
  ]);

  return (
    <>
      {/* <RouterProvider router={router} /> */}
      {isLoading === false
        || window.location.pathname === '/'
        || window.location.pathname === '/login'
        || window.location.pathname === '/register'
        || window.location.pathname.startsWith('/book')
        ?
        <RouterProvider router={router} />
        :
        <Loading />
      }

    </>
  );
}
