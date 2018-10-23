import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
// import { AngularFirestore } from 'angularfire2/firestore';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  // @Output() trainingStart = new EventEmitter<void>();
  constructor(private trainingService: TrainingService) { }
  // trainings: Exercise[] = [];
  // trainings: Observable<Exercise[]>;
  trainings: Exercise[];
  trainingSubscription: Subscription;
  ngOnInit() {
    // this.trainings = this.trainingService.getAvailableExercises();
    this.trainingSubscription = this.trainingService.exercisesChanged.subscribe(exercises => this.trainings = exercises);
    this.trainingService.getAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    // this.trainingStart.emit();
    this.trainingService.startExercise(form.value.training);
  }

  ngOnDestroy() {
    this.trainingSubscription.unsubscribe();
  }

}
