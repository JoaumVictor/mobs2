<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * @OA\Tag(
 * name="Veículos",
 * description="Endpoints para gerenciar veículos"
 * )
 */

class VehicleController extends Controller
{
    /**
     * @OA\Get(
     * path="/vehicles",
     * operationId="getAllVehicles",
     * tags={"Veículos"},
     * summary="Obtém a lista de todos os veículos",
     * description="Retorna um array com todos os veículos cadastrados.",
     * security={{"bearerAuth":{}}},
     * @OA\Response(
     * response=200,
     * description="Operação bem-sucedida",
     * @OA\JsonContent(
     * type="array",
     * @OA\Items(ref="#/components/schemas/Vehicle")
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Não autorizado"
     * )
     * )
     */
    public function index()
    {
        $vehicles = Vehicle::all();
        return response()->json($vehicles, 200);
    }

    /**
     * @OA\Post(
     * path="/vehicles",
     * operationId="createVehicle",
     * tags={"Veículos"},
     * summary="Cria um novo veículo",
     * description="Adiciona um novo veículo ao banco de dados e o retorna.",
     * security={{"bearerAuth":{}}},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(ref="#/components/schemas/VehicleRequest")
     * ),
     * @OA\Response(
     * response=201,
     * description="Veículo criado com sucesso",
     * @OA\JsonContent(ref="#/components/schemas/Vehicle")
     * ),
     * @OA\Response(
     * response=422,
     * description="Dados de validação inválidos"
     * ),
     * @OA\Response(
     * response=401,
     * description="Não autorizado"
     * )
     * )
     */
    public function store(Request $request)
    {
        $request->validate([
            'placa' => 'required|string|unique:vehicles|max:255',
            'modelo' => 'required|string|max:255',
            'fabricante' => 'required|string|max:255',
            'ano' => 'required|integer|min:1900|max:' . date('Y'),
        ]);

        $vehicle = Vehicle::create($request->all());

        return response()->json($vehicle, 201);
    }

    /**
     * @OA\Get(
     * path="/vehicles/{vehicle_id}",
     * operationId="getVehicleById",
     * tags={"Veículos"},
     * summary="Obtém um veículo por ID",
     * description="Retorna um único veículo por ID.",
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(
     * name="vehicle_id",
     * in="path",
     * required=true,
     * @OA\Schema(type="integer"),
     * description="ID do veículo"
     * ),
     * @OA\Response(
     * response=200,
     * description="Operação bem-sucedida",
     * @OA\JsonContent(ref="#/components/schemas/Vehicle")
     * ),
     * @OA\Response(
     * response=404,
     * description="Veículo não encontrado"
     * ),
     * @OA\Response(
     * response=401,
     * description="Não autorizado"
     * )
     * )
     */
    public function show(Vehicle $vehicle)
    {
        return response()->json($vehicle, 200);
    }

    /**
     * @OA\Put(
     * path="/vehicles/{vehicle_id}",
     * operationId="updateVehicle",
     * tags={"Veículos"},
     * summary="Atualiza um veículo existente",
     * description="Atualiza os dados de um veículo por ID.",
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(
     * name="vehicle_id",
     * in="path",
     * required=true,
     * @OA\Schema(type="integer"),
     * description="ID do veículo"
     * ),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(ref="#/components/schemas/VehicleRequest")
     * ),
     * @OA\Response(
     * response=200,
     * description="Veículo atualizado com sucesso",
     * @OA\JsonContent(ref="#/components/schemas/Vehicle")
     * ),
     * @OA\Response(
     * response=404,
     * description="Veículo não encontrado"
     * ),
     * @OA\Response(
     * response=422,
     * description="Dados de validação inválidos"
     * ),
     * @OA\Response(
     * response=401,
     * description="Não autorizado"
     * )
     * )
     */
    public function update(Request $request, Vehicle $vehicle)
    {
        $request->validate([
            'placa' => 'required|string|unique:vehicles,placa,' . $vehicle->id . '|max:255',
            'modelo' => 'required|string|max:255',
            'fabricante' => 'required|string|max:255',
            'ano' => 'required|integer|min:1900|max:' . date('Y'),
        ]);

        $vehicle->update($request->all());

        return response()->json($vehicle, 200);
    }

    /**
     * @OA\Delete(
     * path="/vehicles/{vehicle_id}",
     * operationId="deleteVehicle",
     * tags={"Veículos"},
     * summary="Deleta um veículo",
     * description="Remove um veículo do banco de dados por ID.",
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(
     * name="vehicle_id",
     * in="path",
     * required=true,
     * @OA\Schema(type="integer"),
     * description="ID do veículo"
     * ),
     * @OA\Response(
     * response=204,
     * description="Veículo deletado com sucesso"
     * ),
     * @OA\Response(
     * response=404,
     * description="Veículo não encontrado"
     * ),
     * @OA\Response(
     * response=401,
     * description="Não autorizado"
     * )
     * )
     */
    public function destroy(Vehicle $vehicle)
    {
        $vehicle->delete();
        return response()->json(null, 204);
    }
}
