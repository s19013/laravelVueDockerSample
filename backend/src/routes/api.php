<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TaskController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('/task')->group(function () {
    Route::get('/', [TaskController::class, 'index'])->name('task.index');
    Route::get('/{id}', [TaskController::class, 'getATaskData'])->name('task.getATaskData');
    Route::post('/', [TaskController::class, 'store'])->name('task.store');
    Route::put('/{id}', [TaskController::class, 'update'])->name('task.update');
    Route::delete('/done/{id}', [TaskController::class, 'done'])->name('task.done');
    Route::delete('/{id}', [TaskController::class, 'destroy'])->name('task.destroy');
});
