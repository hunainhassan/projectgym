import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../style/WorkoutForm.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


let WorkoutForm = ({ workout = null, onSave = () => {} }) => {
  let [exercise, setExercise] = useState(workout ? workout.exercise : '');
  let [sets, setSets] = useState(workout ? workout.sets : '');
  let [reps, setReps] = useState(workout ? workout.reps : '');
  let [weight, setWeight] = useState(workout ? workout.weight : '');
  let [category, setCategory] = useState(workout ? workout.category : '');
  let [notes, setNotes] = useState(workout ? workout.notes : '');
  let [tags, setTags] = useState(workout ? workout.tags?.join(', ') : '');

  // Exercise options based on categories
  const exercisesByCategory = {
    strength: ['Squat', 'Deadlift', 'Bench Press', 'Pull-up', 'Row'],
    cardio: ['Running', 'Cycling', 'Jump Rope', 'Rowing', 'Swimming'],
    yoga: ['Downward Dog', 'Warrior Pose', 'Child Pose', 'Cobra Pose', 'Tree Pose'],
    pilates: ['The Hundred', 'Roll-Up', 'Leg Circles', 'Swimming', 'Teaser'],
    crossfit: ['Burpees', 'Kettlebell Swing', 'Thrusters', 'Pull-ups', 'Box Jumps'],
  };

  let [availableExercises, setAvailableExercises] = useState(exercisesByCategory[category] || []);

  useEffect(() => {
    // Update the exercises based on the selected category
    setAvailableExercises(exercisesByCategory[category] || []);
    if (category && !availableExercises.length) {
      setExercise('');
    }
  }, [category]);

  let handleSubmit = (e) => {
    e.preventDefault();
  
    // Wrap the single exercise entry inside exercises array
   let userdata=JSON.parse(localStorage.getItem("user_informartion"))
   console.log(userdata)
    let newWorkout = {
    
      userId: userdata._id, // <== IMPORTANT: provide userId
      exercises: [
        {
          name: exercise,
          sets: parseInt(sets),
          reps: parseInt(reps),
          weight: parseFloat(weight),
          category,
          notes
        }
      ]
    };
  
    if (workout && workout.id) {
      axios.put(`http://localhost:3001/gym/workouts/${workout.id}`, newWorkout)
        .then(() => 
          {  toast.success("Workout updated successfully!");
              onSave()
          })

        .catch(error => console.error("Error updating workout:", error));
    } else {
      axios.post("http://localhost:3001/gym/workouts", newWorkout)
        .then(() => onSave())
        .catch(error => console.error("Error creating workout:", error));
    }
  };
  

  let handleDelete = () => {
    if (workout && workout.id && window.confirm("Are you sure you want to delete this workout?")) {
      axios.delete(`http://localhost:3001/gym/workouts/${workout.id}`)
        .then(() => onSave())
        .catch(error => console.error("Error deleting workout:", error));
    }
  };

  return (
    <div>
        <ToastContainer />
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h3 className={styles.heading}>{workout ? "Edit Workout" : "Add Workout"}</h3>

      <label className={styles.label}>Category:</label>
      <select
        value={category}
        onChange={e => setCategory(e.target.value)}
        required
        className={styles.input}
      >
        <option value="">Select Category</option>
        <option value="strength">Strength</option>
        <option value="cardio">Cardio</option>
        <option value="yoga">Yoga</option>
        <option value="pilates">Pilates</option>
        <option value="crossfit">Crossfit</option>
      </select>

      <label className={styles.label}>Exercise Name:</label>
      <select
        value={exercise}
        onChange={e => setExercise(e.target.value)}
        required
        className={styles.input}
        disabled={!category}
      >
        <option value="">Select Exercise</option>
        {availableExercises.map((ex, index) => (
          <option key={index} value={ex}>{ex}</option>
        ))}
      </select>

      <label className={styles.label}>Sets:</label>
      <input
        type="number"
        value={sets}
        onChange={e => setSets(e.target.value)}
        required
        className={styles.input}
      />

      <label className={styles.label}>Reps:</label>
      <input
        type="number"
        value={reps}
        onChange={e => setReps(e.target.value)}
        required
        className={styles.input}
      />

      <label className={styles.label}>Weight (kg):</label>
      <input
        type="number"
        value={weight}
        onChange={e => setWeight(e.target.value)}
        required
        className={styles.input}
      />

      <label className={styles.label}>Tags (comma separated):</label>
      <input
        type="text"
        value={tags}
        onChange={e => setTags(e.target.value)}
        placeholder="e.g., legs, push, pull"
        className={styles.input}
      />

      <label className={styles.label}>Notes:</label>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        className={styles.textarea}
      />

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.btnSave}>
          {workout ? "Update Workout" : "Add Workout"}
        </button>
        {workout?.id && (
          <button
            type="button"
            className={styles.btnDelete}
            onClick={handleDelete}
          >
            Delete Workout
          </button>
        )}
      </div>
    </form>
    </div>
  );
};

export default WorkoutForm;
