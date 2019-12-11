import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TaskService, Task } from '../shared/task.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.css']
})
export class OrganizerComponent implements OnInit {

  tasks: Task[] = [];

  form: FormGroup;

  constructor(public dateService: DataService,
    private taskService: TaskService) { }

  ngOnInit() {

    this.dateService.date.pipe(
      switchMap(value => this.taskService.load(value))
    ).subscribe(tasks => {
      this.tasks= tasks
    })

    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    })
  }
  submit() {
    const { title } = this.form.value;

    const task: Task = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    }

    this.taskService.creat(task)
      .subscribe(task => {
        console.log(task);
        
        this.form.reset();
      }, error => console.error(error)
      );
  }
remove(task: Task) {
  this.taskService.remove(task)
  .subscribe(()=>{
    this.tasks = this.tasks.filter(t=> t.id!=task.id)
  }, err=>console.error(err)
  )
}
}
