<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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
    Route::get('/create', [TaskController::class, 'create'])->name('task.create');
    Route::post('/store', [TaskController::class, 'store'])->name('task.store');
    Route::get('/edit', [TaskController::class, 'edit'])->name('task.edit');
    Route::put('/update', [TaskController::class, 'update'])->name('task.update');
    Route::delete('/done', [TaskController::class, 'done'])->name('task.done');
    Route::delete('/', [TaskController::class, 'destroy'])->name('task.destroy');
});
