import React from 'react'

const Footer = () => {
  return (
    <footer className="footer ms-4">
       <div className="row">
          <div className="col-md-6 footer_t ">
            <p className='ps-4'>© CPM India</p> <a href="#" />
          </div>
          <div className="col-md-6">
            <div className="text-md-end footer-links d-none d-sm-block">
              <a className='footer_h'>About Us</a>
              <a className='footer_h pe-3'>Help</a> 
            </div>
          </div>
       </div>
    </footer>
    
  )
}

export default Footer ;