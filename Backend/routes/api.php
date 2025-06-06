<?php

use App\Http\Controllers\AddCoordinator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CoordinatorController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/coordinatorAdd', [AddCoordinator::class, 'storeCoordinator']);
Route::post('/coordinator/login', [CoordinatorController::class, 'loginCoordinator']);


Route::post('/addstudents', [CoordinatorController::class, 'storeStudent']); // Add new student
Route::get('/students', [CoordinatorController::class, 'fetchStudents']);   // Fetch all students
Route::put('/UpdateStudent/{student_id}', action: [CoordinatorController::class, 'updateStudent']);  // Update student details
Route::delete('/DeleteStudent/{id}', [CoordinatorController::class, 'deleteStudent']);  // Delete student

Route::post('/tracks', [CoordinatorController::class, 'addTrack']);
Route::get('/ShowTracks', [CoordinatorController::class, 'showTracks']);
Route::put('/UpdateTrack/{id}', [CoordinatorController::class, 'updateTrack']);
Route::delete('/DeleteTrack/{id}', [CoordinatorController::class, 'deleteTrack']);

Route::post('/instructors', [CoordinatorController::class, 'addInstructor']);
Route::get('/ShowInstructor/{id}', [CoordinatorController::class, 'showInstructorById']);
Route::put('/UpdateInstructor/{id}', [CoordinatorController::class, 'updateInstructor']);
Route::delete('/DeleteInstructor/{id}', [CoordinatorController::class, 'deleteInstructor']);


