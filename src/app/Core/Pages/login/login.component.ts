import { ChangeDetectionStrategy, ChangeDetectorRef, Component, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  hide = signal(true);
  formLogin: FormGroup;
  public errorLogin= '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {
    this.formLogin = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required],
    });

  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  login() {
    let data = this.formLogin.getRawValue();

    if (this.formLogin.valid) {
      this.errorLogin = '';
      
      Swal.fire({
        title: 'Iniciando sesión',
        html: '',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.authService.login(data.user!, data.password!).subscribe({
        next: (res: any) => {
          if(!res.error){
            let token  = res.token.jwttoken;
            
            this.authService.saveToken(token);
            
            let decode = this.authService.decodeJwt(token);
            
            this.authService.getInfoUser(decode?.id).subscribe({
              next: (infoUserResult:any) => {
                
                this.authService.saveInfoUser(JSON.stringify(infoUserResult.data[0]));
                this.authService.userInfoLogin = infoUserResult.data[0]
                this.authService.userLogin = decode.nombre.split(' ')[0] + ' ' + decode.nombre.split(' ')[1];

                Swal.close();
                this.router.navigate(['/home']);
              },
              error: e => {
                this.cd.detectChanges();
                Swal.close();
                
                Swal.fire({
                  title: 'Credenciales invalidas, intente nuevamente.',
                  icon: "error",
                  timer: 4000,
                  showConfirmButton: false
                });
              }
            })
          }else{
            this.errorLogin = res.error;
            this.cd.detectChanges();
            Swal.close();
            
            Swal.fire({
              title: 'Credenciales invalidas, intente nuevamente.',
              icon: "error",
              timer: 4000,
              showConfirmButton: false
            });
          }
        },
      });
    }
  }
}
