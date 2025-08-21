<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use Illuminate\Http\Request;

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
     * path="/vehicles/{placa}",
     * operationId="getVehicleByPlaca",
     * tags={"Veículos"},
     * summary="Obtém um veículo por placa",
     * description="Retorna um único veículo por placa.",
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(
     * name="placa",
     * in="path",
     * required=true,
     * @OA\Schema(type="string"),
     * description="Placa do veículo"
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
    public function show($placa)
    {
        $vehicle = Vehicle::where('placa', $placa)->first();

        if (!$vehicle) {
            return response()->json(['message' => 'Veículo não encontrado.'], 404);
        }

        return response()->json($vehicle, 200);
    }

    /**
     * @OA\Put(
     * path="/vehicles/{placa}",
     * operationId="updateVehicleByPlaca",
     * tags={"Veículos"},
     * summary="Atualiza um veículo existente por placa",
     * description="Atualiza os dados de um veículo por placa.",
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(
     * name="placa",
     * in="path",
     * required=true,
     * @OA\Schema(type="string"),
     * description="Placa do veículo"
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
    public function update(Request $request, $placa)
    {
        $vehicle = Vehicle::where('placa', $placa)->first();

        if (!$vehicle) {
            return response()->json(['message' => 'Veículo não encontrado.'], 404);
        }

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
     * path="/vehicles/{placa}",
     * operationId="deleteVehicleByPlaca",
     * tags={"Veículos"},
     * summary="Deleta um veículo por placa",
     * description="Remove um veículo do banco de dados por placa.",
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(
     * name="placa",
     * in="path",
     * required=true,
     * @OA\Schema(type="string"),
     * description="Placa do veículo"
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
    public function destroy($placa)
    {
        $vehicle = Vehicle::where('placa', $placa)->first();

        if (!$vehicle) {
            return response()->json(['message' => 'Veículo não encontrado.'], 404);
        }

        $vehicle->delete();
        return response()->json(null, 204);
    }
}
