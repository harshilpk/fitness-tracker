import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  // @Output() trainingStart = new EventEmitter<void>();
  constructor(private trainingService: TrainingService) { }
  trainings: Exercise[] = [];
  ngOnInit() {
    this.trainings = this.trainingService.getAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    // this.trainingStart.emit();
    this.trainingService.startExercise(form.value.training);
  }

}
