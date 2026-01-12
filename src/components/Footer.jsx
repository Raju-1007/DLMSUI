import React from "react";


export default function Footer() {
  return (
    <footer className="footer-container">

      <div className="footer-content">
        
        {/* COLUMN 1 */}
        <div className="footer-col">
          <h4>About Us</h4>
          {/* <p>Introduction</p>
          <p>Department Functionalities</p> */}
          <p>Organization Structure</p>
          <p>Cadre Strength</p>
        </div>

        {/* COLUMN 2 */}
        <div className="footer-col">
          <h4>Other Links</h4>
          <p>Disclaimer</p>
          <p>Privacy Policy</p>
          <p>Sitemap</p>
          {/* <p>Contact Us</p>
          <p>Feedback</p> */}
        </div>

        {/* COLUMN 3 */}
        <div className="footer-col">
          <h4>Useful Links</h4>
          <p>Copyright Policy</p>
          <p>Disclaimer</p>
          {/* <p>Terms & Conditions</p>
          <p>Privacy policy</p> */}
        </div>

        {/* COLUMN 4 - CONTACT */}
        <div className="footer-col">
          <h4>Contact Us</h4>
          <p>24, Police Parade House,</p>
          <p>Indore Press Complex, Near Sapna</p>
          <p>Sangeeta Road, Indore</p>
          {/* <p>Police Headquarters, Bhopal,</p>
          <p>Madhya Pradesh 462011</p> */}
        </div>

        {/* COLUMN 5 - FOLLOW + HELP */}
        <div className="footer-col">
          <h4>Follow us on</h4>

          <div className="footer-icons">
            <img src="/images/fb.png" alt="fb" />
            <img src="/images/insta.png" alt="insta" />
            <img src="/images/twitter.png" alt="twitter" />
          </div>

          <div className="helpdesk">
            <h4>Help Desk</h4>
            <p>0755-255-3314</p>
          </div>
        </div>

      </div>

      {/* COPYRIGHT BAR */}
      <div className="footer-bottom">
        Copyright © All rights reserved with
      </div>
    </footer>
  );
}
