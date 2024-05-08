import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../customer-services/customer.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild("fileUpload",{static: false}) fileUpload: ElementRef;
  file: File | null = null;
  fileName: string = '';
  isUploaded = false;

  postForm: FormGroup;

  constructor(
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private customerService: CustomerService
  ) { }

  ngOnInit() {
    this.postForm = this.fb.group({
      name: [null, Validators.required],
      content: [null, [Validators.required, Validators.maxLength(5000)]],
      postedBy: [null, Validators.required],
      category: [null, Validators.required],
      file: [null] // Ajoutez un champ pour l'image dans le formulaire
    });
  }

  onClick() {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      const files = fileUpload.files;
      if (files && files.length > 0) {
        this.file = files[0];
        this.fileName = this.file.name;
        this.isUploaded = true;
      }
    };
    fileUpload.click();
  }

  createNewPost() {
    if (!this.file) {
      this.snackBar.open("Please select a file.", "Close", {
        duration: 5000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', this.postForm.value.name);
    formData.append('content', this.postForm.value.content);
    formData.append('postedBy', this.postForm.value.postedBy);
    formData.append('category', this.postForm.value.category);
    formData.append('file', this.file);

    this.customerService.createNewPost(formData).subscribe({
      next: (res) => {
        if (res.id != null) {
          this.snackBar.open("Success: Post added successfully", "Close", {
            duration: 5000,
            panelClass: ['snackbar-success']
          });
        } else {
          this.snackBar.open("Error: Something went wrong", "Close", {
            duration: 5000,
            panelClass: ['snackbar-error']
          });
        }
      },
      error: (error) => {
        this.snackBar.open("Error: Something went wrong", "Close", {
          duration: 5000,
          panelClass: ['snackbar-error']
        });
      },
      complete: () => {
        console.log("Observable completed");
      }
    });
  }
}
