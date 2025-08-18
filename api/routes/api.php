<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VehicleController;

// Rota de teste
Route::get('/ping', fn() => response()->json(['pong' => true]));

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rotas protegidas por Sanctum
Route::middleware('auth:sanctum')->group(function () {
  Route::apiResource('vehicles', VehicleController::class);
});
