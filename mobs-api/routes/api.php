<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\VehicleController;

Route::get('/login', function (Request $request) {
  return response()->json(['message' => 'Não autenticado.'], 401);
})->name('login');

Route::get('/ping', fn() => response()->json(['pong' => true]));

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
  Route::apiResource('vehicles', VehicleController::class);
  Route::get('vehicles/{placa}', [VehicleController::class, 'showByPlaca']);
});
