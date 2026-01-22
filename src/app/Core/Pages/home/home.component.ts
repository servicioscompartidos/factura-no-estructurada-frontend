import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
// import { firstValueFrom, map, Observable, startWith } from 'rxjs';
import { firstValueFrom, Observable } from 'rxjs';
import { map,  startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';
import { HomeService } from '../../Services/home.service';
import { AuthService } from '../../Services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import Swal from 'sweetalert2'
import { Supplier } from '../../../Shared/Models/home.model';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';

const UPLOAD=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cloud-arrow-up" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708z"/>
<path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
</svg>`;

const PHOTO=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera" viewBox="0 0 16 16">
  <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z"/>
  <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
</svg>`;

const DELETE=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg>`;

const CHECK=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-image" viewBox="0 0 16 16">
  <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
  <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>
</svg>`;

const LOGOUT=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
  <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
</svg>`;

const EYE=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
</svg>`;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatIconModule, 
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    AsyncPipe, 
    MatAutocompleteModule, 
    MatInputModule,
    MatTabsModule,
    MatSelectModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  listFiles: any[] = [];
  listModels: any[] = [];
  listModelsSelect: any[] = [];
  headerInvoice:any;
  listBodyInvoice: any[] = [];

  listCifModels: string[] = [];
  listFilesBills: any[] = [];
  isSimpleLoad = true;

  typesInvoices: any[] = [
    {value: 'others__pBqvF', name: 'Factura Normal'},
    {value: 'others__kDwka', name: 'Impresion Termica'},
    {value: 'others__XMnoq', name: 'Factura No Estructurada'},
    {value: '2', name: 'Factura Doble tabla'},
  ];

  typesInvoicesInventory: any[] | undefined; 

  // typeValueInvoiceSelect:undefined | { model_type: string, name: string };

  readonly dialog = inject(MatDialog);
  nameTapSelect = '';
  indexTap = 0;

  supplier = new FormControl();
  invoiceTypeSelect = new FormControl();
  supplierBill = new FormControl();
  options: Supplier[] = [];
  filteredOptions: Observable<Supplier[]> | undefined;
  infoUser:any;

  constructor(
    private router: Router, 
    private homeService: HomeService,
    public authService: AuthService,
    private cdRef: ChangeDetectorRef
  ){
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);

    iconRegistry.addSvgIconLiteral(
      'upload_icon',
      sanitizer.bypassSecurityTrustHtml(UPLOAD)
    );

    iconRegistry.addSvgIconLiteral(
      'photo_icon',
      sanitizer.bypassSecurityTrustHtml(PHOTO)
    );

    iconRegistry.addSvgIconLiteral(
      'delete_icon',
      sanitizer.bypassSecurityTrustHtml(DELETE)
    );

    iconRegistry.addSvgIconLiteral(
      'check_icon',
      sanitizer.bypassSecurityTrustHtml(CHECK)
    );

    iconRegistry.addSvgIconLiteral(
      'logout_icon',
      sanitizer.bypassSecurityTrustHtml(LOGOUT)
    );

    iconRegistry.addSvgIconLiteral(
      'eye_icon',
      sanitizer.bypassSecurityTrustHtml(EYE)
    );

    this.infoUser = this.authService.getInfoSessionUser();
    if(!!this.infoUser){
      this.infoUser = JSON.parse(this.infoUser);
    }

    this.getModels();
    
  }

  async capturePhotoBills(){
    console.log('capturar fotoo...');

  }

  getSupplier(){
    this.homeService.getSuppliers(this.infoUser.accgasstationid, this.infoUser.avaloncustomercompanyid)
    .subscribe({
      next: (resultSuppliers:any) => {

        this.options = resultSuppliers.data.filter((supplier:any) => this.listCifModels.includes(supplier.cif));

        this.filteredOptions = this.supplier.valueChanges.pipe(
          startWith(''),
          map(value => {
            const name = typeof value === 'string' ? value : value?.name;
            return name ? this._filter(name as string) : this.options.slice();
          }),
        );
      },
      error: (err:any) => {
        // console.log(err);
        alert(`error ${ err.message }`)
      }
    })
  }

  getModels(){
    this.homeService.getModels(this.infoUser.avaloncustomercompanyid)
    .subscribe({
      next: (res:any) => {
        this.listModels = res.data;
        this.listCifModels = res.data.map((item:any) => item.supplier_id);

        this.getSupplier();
        
      },
      error: e => console.log
    })
  }

  onFilesSelected(e:any, type:string){
    e.preventDefault();

    if(type != 'inventaryPhoto' && type != 'billsPhoto'){
      this.listFiles = [];
      this.listFilesBills = [];
    }

    let input = e.target as HTMLInputElement;
    
    if (input.files && input.files.length > 0) {
      const archivos = Array.from(input.files);
      
      archivos.forEach(file => {
        let sizeKb = (file.size/1000).toFixed(2);
        if(type.includes('inventary')){
          this.listFiles.push({ name: file.name.length > 20 ? `${file.name.split('.')[0].substring(0,20)}.${file.name.split('.')[1]} ` : file.name, size: parseFloat(sizeKb) > 1000 ? `${(parseFloat(sizeKb)/1000).toFixed(2)} MB` : `${sizeKb} KB`, file, error:'' })
        }else{
          this.listFilesBills.push({ name: file.name, size: parseFloat(sizeKb) > 1000 ? `${(parseFloat(sizeKb)/1000).toFixed(2)} MB` : `${sizeKb} KB`, file, error:'Inconveniente al cargar la factura' })
        }
      });

      input.value = '';
    }
  }

  loadInvoiceMultiple(e:any, type:string){
    let input = e.target as HTMLInputElement;

    if(type =='header' && input.files && input.files.length > 0){
      let file = input.files[0]
      this.headerInvoice = file;

    }else if(type =='body'){

      if (input.files && input.files.length > 0) {
        const archivos = Array.from(input.files);
        
        archivos.forEach(file => {
          let sizeKb = (file.size/1000).toFixed(2);
          this.listBodyInvoice.push({ name: file.name.length > 20 ? `${file.name.split('.')[0].substring(0,20)}.${file.name.split('.')[1]} ` : file.name, size: parseFloat(sizeKb) > 1000 ? `${(parseFloat(sizeKb)/1000).toFixed(2)} MB` : `${sizeKb} KB`, file, error:'' })
        });

        input.value = '';
      }
    }
  }

  deleteHeader(){
    this.headerInvoice = undefined;
  }

  onSelect(e:any){
    let cifSelect = e.option.value.cif;
    let typeInvoiceFind = this.listModels.filter(item => item.supplier_id == cifSelect);

    this.listModelsSelect = typeInvoiceFind;

    let list:any[] = [];

    typeInvoiceFind.forEach( (type:any) => {
      if(list.length > 0){
        const index = list.findIndex( l => l.id == type.id);

        if(index < 0){
          list.push(type);
        }
      }else{
        list.push(type);
      }
    })

    if(list.length == 1){
      this.invoiceTypeSelect.setValue(list[0]);
      this.isSimpleLoad = true;
      
    }
    // console.log({ typeInvioceFind });
    this.typesInvoicesInventory = list;
  }

  onFileCapture(e:any){

    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    let sizeKb = (file.size/1000).toFixed(2);
    this.listFiles.push({ name: file.name.length > 20 ? `${file.name.split('.')[0].substring(0,20)}.${file.name.split('.')[1]} ` : file.name, size: parseFloat(sizeKb) > 1000 ? `${(parseFloat(sizeKb)/1000).toFixed(2)} MB` : `${sizeKb} KB`, file, error:'' })
    
  }

  deleteFile(index:number, type: string){
    if(type == 'inventary'){
      this.listFiles.splice(index, 1);
    }else if(type == 'body'){
      this.listBodyInvoice.splice(index,1);
    }else{
      this.listFilesBills.splice(index, 1);
    }
  }

  private _filter(value: string): Supplier[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.suppliercompanyname.toLowerCase().includes(filterValue));
  }

  viewFile(item:any){
    this.dialog.open(ViewInvoiceComponent, {
      width: '90%', 
      height: '90%',
      data: { file: item.file ?? item }
    });
  }

  onTabChanged(e:any){
    this.indexTap = e.index;
    // this.supplier.setValue('');
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }

  typeInvoiceSelect(e:any, type: string){
    // type: inventory or bills
    // console.log({ select: e.value, type });
    let typeInvoice = e.value;

    if(type == 'inventory'){

      let isMultiple = typeInvoice.is_multiple;

      if(isMultiple){
        this.isSimpleLoad = false;
        
      }else{
        this.isSimpleLoad = true;
      }
    }
    
  }

  async sendInvoices(){

    if(this.indexTap == 0){
      
      Swal.fire({
        title: "Envió de factura",
        html: '¿Está seguro de enviar la factura ingresada?',
        showCancelButton: true,
        confirmButtonText: "Enviar Factura",
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {

            Swal.fire({
              title: 'Enviando Factura',
              html: 'Por favor espere',
              allowOutsideClick: false,
              customClass: {
                title: 'alertTitle'
              },
              didOpen: () => {
                Swal.showLoading();
              }
            });
  
            let form = new FormData();
            form.append('type', this.invoiceTypeSelect.value.model_type);
            form.append('shop', this.infoUser.gasstationid);
            form.append('account', this.infoUser.accgasstationid);
            form.append('country', this.infoUser.avaloncustomercompanyid);
            form.append('cif', this.supplier.value.cif);
            form.append('ismultiple', '0');
      
            for (const file of this.listFiles) {
              form.append('files', file.file );
            }

            const resultSendInvoice:any = await firstValueFrom(this.homeService.sendInvoice(form));
            
            Swal.close();
  
            if(!!resultSendInvoice.error){
              
              Swal.fire({
                title: resultSendInvoice.error,
                icon: "error",
                timer: 6000,
                showConfirmButton: false
              });
            }else{
  
              Swal.fire({
                title: "Listo",
                icon: "success",
                timer: 4000,
                showConfirmButton: false
              });
            }
            
          } catch (error) {
  
            Swal.close();
  
            Swal.fire({
              title: 'Se presento inconveniente  al cargar su factura, por favor inténtelo nuevamente.',
              icon: "error",
              timer: 6000,
              showConfirmButton: false
            });
          }

          this.clearAutocomplete(1);
          this.listFiles = [];
          this.invoiceTypeSelect.setValue('');

        } 
      });

    }else{
      // console.log('Send invoices bills');
    }
  }

  sendInvoiceMultipleModel(){
    
    Swal.fire({
        title: "Envió de factura",
        html: '¿Está seguro de enviar la factura ingresada?',
        showCancelButton: true,
        confirmButtonText: "Enviar Factura",
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {

            Swal.fire({
              title: 'Enviando Factura',
              html: 'Por favor espere',
              allowOutsideClick: false,
              customClass: {
                title: 'alertTitle'
              },
              didOpen: () => {
                Swal.showLoading();
              }
            });
            
            let form = new FormData();
            form.append('shop', this.infoUser.gasstationid);
            form.append('account', this.infoUser.accgasstationid);
            form.append('country', this.infoUser.avaloncustomercompanyid);
            form.append('ismultiple', '1');
            form.append('files', this.headerInvoice);
            
            this.listBodyInvoice.forEach(item => {
              form.append('files', item.file);
            });
            
            let filter = this.listModelsSelect.filter((m:any) => m.id == this.invoiceTypeSelect.value.id);
            console.log(filter);
            
            filter.forEach(f => {
              form.append('models', f.model_name)
            });

            const resultSendInvoice:any = await firstValueFrom(this.homeService.sendInvoice(form));
            
            Swal.close();
            
            if(!!resultSendInvoice.error){
              
              Swal.fire({
                title: resultSendInvoice.error,
                icon: "error",
                timer: 6000,
                showConfirmButton: false
              });
            }else{
  
              Swal.fire({
                title: "Listo",
                icon: "success",
                timer: 4000,
                showConfirmButton: false
              });
            }

            
            this.headerInvoice = undefined;
            this.listBodyInvoice = [];
            this.clearAutocomplete(1);
            this.invoiceTypeSelect.setValue('');
            this.isSimpleLoad = true;
          } catch (error) {
  
            Swal.close();
  
            Swal.fire({
              title: 'Se presento inconveniente  al cargar su factura, por favor inténtelo nuevamente.',
              icon: "error",
              timer: 6000,
              showConfirmButton: false
            });
          }

        } 
      });
      
  }
  
  displayFn(option: any) {
    return option?.suppliercompanyname;
  }

  clearAutocomplete(type:number){
    if(type == 1){
      this.supplier.setValue('');
    }else{
      this.supplierBill.setValue('');
    }
  }
}
