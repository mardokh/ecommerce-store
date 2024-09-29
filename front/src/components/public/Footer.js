import React from 'react';
import '../../styles/components.public/footer.css';
import logo from '../../images/logonoback.png'


const Footer = () => {

   return (
      <div className='footer_container'>

            <div className='footer_contact_container'>

               <div className='footer_email'>
                  <i class="fa-solid fa-envelope"></i>
                  <p>beynour@gmail.com</p>
               </div>

               <div className='footer_phone'>
                  <i class="fa-solid fa-square-phone"></i>
                  <p>+213 056 12 68 13</p>
               </div>

            </div>

            <img src={logo} className='footer_logo'/>

            <div className='footer_social_container'>

               <div className='footer_subscribe_container'>
                  <input type='text' placeholder='votre adress mail'/>
                  <div className='footer_subscribe'>
                     <p>inscription</p>
                  </div>
               </div>

               <div className='footer_social_icons'>
                  <p>nous suivre |</p>
                  <i class="fa-brands fa-twitter"></i>
                  <i class="fa-brands fa-instagram"></i>
                  <i class="fa-brands fa-facebook"></i>
                  <i class="fa-brands fa-youtube"></i>
               </div>

            </div>

      </div>
   )
} 



export default Footer;