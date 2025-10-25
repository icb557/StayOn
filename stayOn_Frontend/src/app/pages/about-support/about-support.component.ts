import { Component } from '@angular/core';
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-about-support',
  templateUrl: './about-support.component.html',
  styleUrls: ['./about-support.component.css']
})
export class AboutSupportComponent {
  
  sendEmail(event: Event) {
    event.preventDefault();
    emailjs.sendForm('service_5h6m471', 'template_1xer6nd', event.target as HTMLFormElement, 'RjlpFFov7K0MV98Vw')
      .then(() => {
        Swal.fire({
                  title: 'correo enviado',
                  text: 'Te responderemos lo antes posible!',
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 1200,
                });
        (event.target as HTMLFormElement).reset();
      })
      .catch((error) => {
        Swal.fire({
                  title: 'Error!',
                  text: 'Ha ocurrido un error',
                  icon: 'error',
                  showConfirmButton: false,
                  timer: 1200,
                });
      });
  }

  clearForm() {
    const form = document.querySelector('form');
    form?.reset();
  }
}