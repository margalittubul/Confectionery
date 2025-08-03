import './StyleHeader.css'
import { Link } from 'react-router-dom';
export default function Button()
{
    return(
            <>
              <Link to="/Picthur" className="link-button"> דף הבית</Link>
              <Link to="/about" className="link-button">אודותינו</Link>
              <Link to="/contact" className="link-button">צור קשר</Link>
              <Link to="/category" className="link-button">קונדיטוריה</Link>
              <Link to="/order" className="link-button">הזמנות</Link>
              
            </>
    );
}