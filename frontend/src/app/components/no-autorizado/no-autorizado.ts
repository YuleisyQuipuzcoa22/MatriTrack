import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-autorizado',
  imports: [],
  templateUrl: './no-autorizado.html',
  styleUrl: './no-autorizado.css'
})
export class NoAutorizado {
 constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/login']);
  }
}
