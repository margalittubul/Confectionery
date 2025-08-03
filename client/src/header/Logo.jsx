import './StyleHeader.css'
import { Link } from 'react-router-dom';
import logo from '/img/מתוק מהבית .png';

export default function Logo(){
    
    return(
        <Link to='/Picthur'>
            <img
             src={logo}
             className="logo-image"
            />
        </Link>
    );
}