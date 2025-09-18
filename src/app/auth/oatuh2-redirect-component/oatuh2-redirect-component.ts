import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/usuario/auth-service';
import { URL_BACKEND } from '../../config/config';
import { REDIRECT_URL } from '../../config/config';
@Component({
  selector: 'app-oatuh2-redirect-component',
  imports: [],
  templateUrl: './oatuh2-redirect-component.html',
  styleUrl: './oatuh2-redirect-component.css'
})
export class OAtuh2RedirectComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService:AuthService
  ) { }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (!code) {
        console.error('No authorization code present!');
        return;
      }
    
      // Construimos los parámetros para client_secret_post
      const body = new URLSearchParams();
      body.set('grant_type', 'authorization_code');
      body.set('code', code);
      body.set('redirect_uri', REDIRECT_URL);

      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa('angularapp:12345') // base64(client_id:client_secret)
      });

      this.http.post(`${URL_BACKEND}/oauth2/token`, body.toString(), { headers })
        .subscribe((token: any) => {
          this.authService.guardarToken(token.access_token)
          this.authService.guardarRefreshToken(token.refresh_token)
          this.router.navigate(['/']); // redirige a home
        });
    })


  }
}

