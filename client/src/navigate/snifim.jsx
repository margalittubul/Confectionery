import './snifim.css';
export default function snifim(){
    return(
        <>
        <div className="snifim-container">

        <div className='text'>
            <img src='/img/מפה.jpg'></img>
            <h3>מחכים לכם בסניפים שלנו</h3>
            <h3 className="">בראשון-חמישי</h3>
            <h3 className="">בין השעות 9:00 עד 20:00</h3>
            <h3 className="">בימי שישי וערבי חג</h3>
            <h3 className="">בין השעות 8:00 ל-13:00</h3>
            <h3 className="">בסניפים שלנו</h3>
        </div> 
        <div>
            <img src='/img/חנות.jpg'  className="img-style"></img>
        </div>
            
        </div>  

        <div className="branches-row">
            <div className="branch-item">
                <h3>חיפה: טרומפלדור 30 <img src="/img/מיקום.jpg" className="styleImg" /></h3>
            </div>
            <div className="branch-item">
                <h3>בני ברק: ז'בוטינסקי 55 <img src="/img/מיקום.jpg" className="styleImg" /></h3>
            </div>
            <div className="branch-item">
                <h3>ירושלים: המלך ג'ורג' 12 <img src="/img/מיקום.jpg" className="styleImg" /></h3>
            </div>
        </div>
        </>
    );
}