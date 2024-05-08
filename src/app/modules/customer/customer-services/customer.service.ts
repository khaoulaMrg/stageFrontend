import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private SERVER_URL = "http://localhost:8081/api/autho/";

  constructor(private http: HttpClient) { }

  createNewPost(postData: FormData): Observable<any> {
    return this.http.post(this.SERVER_URL + "create", postData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
