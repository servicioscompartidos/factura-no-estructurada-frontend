import { Component } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';


@Component({
  selector: 'app-view-invoice',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatButtonModule
  ],
  templateUrl: './view-invoice.component.html',
  styleUrl: './view-invoice.component.scss'
})
export class ViewInvoiceComponent {
  imagen: string | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { file:any }) {
    if(!!data.file){
      const lector = new FileReader();
      lector.readAsDataURL(data.file);

      lector.onload = () => {
        this.imagen = lector.result as string;
      };

    }
  }


}
