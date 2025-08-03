import { Link } from 'react-router-dom';
import './StyleNavigate.css'
import { useParams } from 'react-router-dom';
export default function Navigate2()
{
    const { orderId } = useParams();
    return(
        <>
        <div  className="ground">
            <footer>
                <div className="footer-grid">
                    <div>
                        <Link to="/CakeChallenge">
                            <img className="li" src="/img/game.jpg"/>
                        </Link>
                    </div>
                    <div>
                        
                    </div>
                    <div>
                        <Link to="/contact" className="">צור קשר</Link>
                        <br/>
                        <Link to="/ClubJoin" className="">מועדון</Link>
                    </div>
                    <div>
                        <Link to="/about" className="">אודות</Link>
                        <br/>
                        <Link to="/articles" className="">תקנון ותנאי שימוש</Link>
                        <br/>
                        <Link to="/snifim" className="">סניפים</Link>
                    </div>
                    <div>
                        <Link to="/order" className="">הזמנות</Link>
                        <br/>
                        <Link to="/buying" className="">סל שלי</Link>
                        <br/>
                        {/* להכניס קוד הזמנה order.id */}
                        {/* <Link to={`/tashlum/${1}`} className="">תשלום</Link> */}
                    </div>
                    <div>
                        <Link to="/Category" className="">קונדיטוריה</Link>
                        <br/>
                        <Link to={`/SubCategory/${1}`} className="">עוגות חלביות</Link>
                        <br/>
                        <Link to={`/SubCategory/${2}`} className="">עוגות פרווה</Link>
                        <br/>
                        <Link to={`/SubCategory/${3}`} className="">עוגות אירועים</Link>
                        <br/>
                        <Link to={`/SubCategory/${5}`} className="">עוגיות</Link>
                        <br/>
                        <Link to={`/SubCategory/${4}`} className="">מארזים</Link>
                    </div>
                    <div>
                        <Link to="/login" className="">התחברות</Link>
                        <br/>
                        <Link to="/" className="">כניסה</Link>
                        <br/>
                        <Link to="/manager" className="">מנהל</Link>
                    </div>
                   
                </div>
            </footer>
        </div>
        <p>@margalittubul</p>
        </>
    );
}