import './StyleHeader.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCustomerProfile } from '../API/CustomerController';

export default function Button() {
    const [username, setUsername] = useState('אורח');

    const getUserData = async () => {
        const profile = await getCustomerProfile();
        if (profile && profile.name) {
            setUsername(profile.name);
        } else {
            setUsername('אורח');
        }
    };

    useEffect(() => {
        getUserData();
        const handleLogin = () => getUserData();
        const handleLogout = () => getUserData();

        window.addEventListener("user-logged-in", handleLogin);
        window.addEventListener("user-logged-out", handleLogout);

        return () => {
            window.removeEventListener("user-logged-in", handleLogin);
            window.removeEventListener("user-logged-out", handleLogout);
        };
    }, []);

    return (
        <>
            <Link to={`/profile/${username}`} className="link-button2">{username}</Link>
            <Link to="/" className="link-button2">כניסה</Link>
            <Link to="/login" className="link-button2">התחברות</Link>
            <Link to="/buying" className="link-button2">סל שלי</Link>
            <Link className="link-button2" to='/search'>
                <img src='/img/magnifying_glass.jpg' height={'25px'} width={'25px'} alt="חיפוש" />
            </Link>
        </>
    );
}
