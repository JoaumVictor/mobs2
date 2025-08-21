<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @OA\Schema(
 * schema="Vehicle",
 * type="object",
 * title="Vehicle",
 * description="Representação de um veículo",
 * @OA\Property(property="id", type="integer", example=1),
 * @OA\Property(property="placa", type="string", example="ABC-1234"),
 * @OA\Property(property="modelo", type="string", example="Civic"),
 * @OA\Property(property="fabricante", type="string", example="Honda"),
 * @OA\Property(property="ano", type="integer", example=2020)
 * )
 */
class Vehicle extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'placa',
        'modelo',
        'fabricante',
        'ano',
    ];
}