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
import { Model, ResponseModel, ResponseSupplier, Supplier } from '../../../Shared/Models/home.model';
import { CHECK, DELETE, EYE, LOGOUT, PHOTO, UPLOAD } from '../../../Shared/Icons/icons';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';

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
      next: (resultSuppliers: ResponseSupplier) => {

        this.options = resultSuppliers.data.filter((supplier:Supplier) => this.listCifModels.includes(supplier.cif));

        this.filteredOptions = this.supplier.valueChanges.pipe(
          startWith(''),
          map(value => {
            const name = typeof value === 'string' ? value : value?.name;
            return name ? this._filter(name as string) : this.options.slice();
          }),
        );
      },
      error: (err:any) => console.error('Error al obtener los proveedores:', err)
    })
  }

  getModels(){
    this.homeService.getModels(this.infoUser.avaloncustomercompanyid)
    .subscribe({
      next: (res: ResponseModel) => {
        this.listModels = res.data;
       
        this.listCifModels = res.data.map((item:any) => item.supplier_id);

        this.getSupplier();
        
      },
      error: (err:any) => {
        console.error('Error al obtener los modelos:', err);
        
      }
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

  onFileCapture(e:any, type:string){

    let input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    if(type == 'inventary'){
      const file = input.files[0];
      
      let sizeKb = (file.size/1000).toFixed(2);
      this.listFiles.push({ name: file.name.length > 20 ? `${file.name.split('.')[0].substring(0,20)}.${file.name.split('.')[1]} ` : file.name, size: parseFloat(sizeKb) > 1000 ? `${(parseFloat(sizeKb)/1000).toFixed(2)} MB` : `${sizeKb} KB`, file, error:'' });
      
    }else if(type == 'header'){

      const file = input.files[0];
      this.headerInvoice = file;
      input.value = '';

    }else if(type == 'body'){

      const archivos = Array.from(input.files);
        
      archivos.forEach(file => {
        let sizeKb = (file.size/1000).toFixed(2);
        this.listBodyInvoice.push({ name: file.name.length > 10 ? `${file.name.split('.')[0].substring(0,10)}.${file.name.split('.')[1]} ` : file.name, size: parseFloat(sizeKb) > 1000 ? `${(parseFloat(sizeKb)/1000).toFixed(2)} MB` : `${sizeKb} KB`, file, error:'' });
      });

      input.value = '';

    }
    
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

  sizeFileHeader(size:number){
    let sizeKb = (size/1000).toFixed(2);
    return parseFloat(sizeKb) > 1000 ? ((parseFloat(sizeKb)/1000).toFixed(2)+' MB') : (sizeKb +' KB');
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

    if(this.indexTap == 0 && this.listFiles.length > 0){
      
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
