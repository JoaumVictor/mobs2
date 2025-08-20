<?php

namespace App\Schemas;

/**
 * @OA\Schema(
 *     schema="Vehicle",
 *     type="object",
 *     title="Vehicle",
 *     description="Representação de um veículo",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="placa", type="string", example="ABC-1234"),
 *     @OA\Property(property="modelo", type="string", example="Civic"),
 *     @OA\Property(property="fabricante", type="string", example="Honda"),
 *     @OA\Property(property="ano", type="integer", example=2020)
 * )
 *
 * @OA\Schema(
 *     schema="VehicleRequest",
 *     type="object",
 *     required={"placa","modelo","fabricante","ano"},
 *     @OA\Property(property="placa", type="string", example="ABC-1234"),
 *     @OA\Property(property="modelo", type="string", example="Civic"),
 *     @OA\Property(property="fabricante", type="string", example="Honda"),
 *     @OA\Property(property="ano", type="integer", example=2020)
 * )
 */
class Schemas
{
}
