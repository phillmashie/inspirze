

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { StudentsModule } from './students/students.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthenticationService } from './authentication/authentication.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './alert/alert.component';
import { AlertService } from './alert/alert.service';
import { routing } from './app.routing';
import { AuthGuard } from './authentication/auth.guard';
import { RoleGuard } from './authentication/role.guard';
import { PersonalGuard } from './authentication/personal.guard';

import { QuillModule } from 'ngx-quill';
import { MaterialModule } from './shared/material/material.module';

import { DragDropVideoUploadDirective } from './shared/ui/drag-drop-video-upload/drag-drop-video-upload.directive';
import { DragDropVideoUploadComponent } from './shared/ui/drag-drop-video-upload/drag-drop-video-upload.component';
import { BottomToolbarComponent } from './shared/ui/bottom-toolbar/bottom-toolbar.component';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoursesComponent } from './courses/courses.component';
import { ListCoursesComponent } from './courses/list/listcourses.component';
import { CreateCourseComponent } from './courses/create/createcourse.component';
import { CourseSectionComponent } from './courses/create/course-section/course-section.component';
import { CourseLectureComponent } from './courses/create/course-section/course-lecture/course-lecture.component';
import { CoursesService } from './courses/courses.service';
import { CourseDetailComponent } from './courses/details/coursedetail.component';
import { UpdateCourseComponent } from './courses/update-course/update-course.component';
import { QuillMaterialComponent } from './shared/quill-material/quill-material.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AlertComponent,
    CoursesComponent,
    ListCoursesComponent,
    CreateCourseComponent,
    CourseSectionComponent,
    CourseLectureComponent,
    CourseDetailComponent,
    UpdateCourseComponent,
    BottomToolbarComponent,
    DragDropVideoUploadComponent,
    DragDropVideoUploadDirective,
    QuillMaterialComponent,





  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    StudentsModule,
    routing,
    QuillModule.forRoot(),
    MaterialModule,
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    routing,
    MaterialModule,
    LayoutModule,
    FlexLayoutModule,
    QuillModule.forRoot(),


  ],
  providers: [
    AuthGuard,
    RoleGuard,
    PersonalGuard,
    AuthenticationService,
    AlertService,
    CoursesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
