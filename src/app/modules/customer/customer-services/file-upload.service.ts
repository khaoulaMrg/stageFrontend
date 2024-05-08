import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpRequest, HttpEventType, HttpResponse, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private SERVER_URL = "http://localhost:8081/api/autho/";

  constructor(private http: HttpClient) { }

  upload(formData: FormData): Observable<any> {
    const uploadUrl = `${this.SERVER_URL}/create`;
    const req = new HttpRequest('POST', uploadUrl, formData, {
      reportProgress: true,
    });

    return this.http.request(req).pipe(
      map(event => this.getEventMessage(event)),
      catchError(this.handleError)
    );
  }

  private getEventMessage(event: HttpEvent<any>): string {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        return `File is ${Math.round(event.loaded / event.total * 100)}% uploaded`;
      case HttpEventType.Response:
        return `File uploaded successfully.`;
      default:
        return `File upload event: ${event.type}.`;
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
