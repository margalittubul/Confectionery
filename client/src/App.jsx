import {createBrowserRouter ,RouterProvider} from 'react-router-dom'
import './App.css'

import Picthur from './home/Picthur'
import Buying from './buying/buying';
import Tashlum from './buying/tashlum'
import OkOrder from './buying/okOrder'
import About from './about/about'
import Contact from './contact/ccontact';
import Category from './konditurya/categoryot';
import SubCategory from './konditurya/Subcategory';
import Order from './order/order';
import OrderDetails from './order/order-details';
import Login from './login/login'
import Singin from './singin/singin'
import Cake from './konditurya/cake'

import Serch from './serch/serch'

import ClubJoin from './navigate/ClubJoin';
import Articles from './navigate/articles';
import Snifim from './navigate/snifim';

import CakeChallenge from './navigate/CakeChallenge';

import Root from './Root/Root';

import UpdateCake from './maneger/updateProduct';
import AddCake from './maneger/addProduct';

import Manager from './maneger/maneger';
import AddProductForm from './maneger/addProduct';
import EditProductForm from './maneger/updateProduct';
import AllUsersPage from './maneger/AllUsersPage';
import AddAdmin from './maneger/AddAdmin';

import Profile from './header/Profile';

import RequireAdmin from './maneger/RequireAdmin'

function App() {
  const router=createBrowserRouter([{
    path: '/',
    element: <Root/>,
    children:[
      {path:'/Picthur', element:<Picthur /> },
      {path:'/Buying', element:<Buying /> },
      {path:'/Tashlum/:orderId', element:<Tashlum /> },
      {path:'/OkOrder/:orderId', element:<OkOrder /> },
      {path:'/About', element:<About /> },
      {path:'/Contact', element:<Contact /> },
      {path:'/Category', element:<Category /> },
      {path:'/SubCategory/:categoryId', element:<SubCategory /> },
      {path:'/Order', element:<Order /> },
      {path:'/order-details/:orderId', element:<OrderDetails /> },
      {path:'/Login', element:<Login /> },
      {path:'/', element:<Singin /> },
      {
        path:'/Cake/:cakeId', 
        element:<Cake/>, 
      },
      {path:'/search', element:<Serch /> },

      {path:'/ClubJoin', element:<ClubJoin /> },
      {path:'/Articles', element:<Articles /> },
      {path:'/Snifim', element:<Snifim /> },

      {path:'/CakeChallenge', element:<CakeChallenge /> },

      {path:'/UpdateCake/:cakeId',element:<UpdateCake/>},
       {path:'/AddCake',element:<AddCake/>},

       {path:'/manager',element:<RequireAdmin><Manager /></RequireAdmin>},
       {path:'/AddProductForm',element:<AddProductForm/>},
       {path:'/EditProductForm/:id',element:<EditProductForm/>},
       {path:'/AllUsersPage',element:<AllUsersPage/>},
       {path: '/AddAdmin', element:<AddAdmin/>},

       {path:'/profile/:username', element:<Profile/>}

    ]
  }])
  return (
    <>
      <RouterProvider router={router}/>
    </>
  )
}

export default App
