<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

/**
 * @OA\Info(
 * version="1.0.0",
 * title="API do Projeto MOBS2",
 * description="Documentação da API RESTful do Projeto MOBS2 para veículos e autenticação de usuários.",
 * @OA\Contact(
 * email="seu-email@exemplo.com"
 * ),
 * @OA\License(
 * name="Apache 2.0",
 * url="http://www.apache.org/licenses/LICENSE-2.0.html"
 * )
 * )
 *
 * @OA\Server(
 * url="http://localhost:8000/api",
 * description="Servidor de Desenvolvimento"
 * )
 *
 * @OA\Tag(
 * name="Autenticação",
 * description="Endpoints de registro e login de usuários"
 * )
 *
 * @OA\SecurityScheme(
 * type="http",
 * description="Insira o token JWT com o prefixo 'Bearer' no header de autorização",
 * name="Bearer Token",
 * in="header",
 * scheme="bearer",
 * bearerFormat="JWT",
 * securityScheme="bearerAuth",
 * )
 */
class AuthController extends Controller
{
    /**
     * @OA\Post(
     * path="/register",
     * operationId="registerUser",
     * tags={"Autenticação"},
     * summary="Registra um novo usuário no sistema",
     * description="Cria uma nova conta de usuário com nome, email e senha e retorna um token JWT.",
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"name","email","password"},
     * @OA\Property(property="name", type="string", example="Victor"),
     * @OA\Property(property="email", type="string", format="email", example="victor@example.com"),
     * @OA\Property(property="password", type="string", format="password", example="senha123")
     * )
     * ),
     * @OA\Response(
     * response=201,
     * description="Usuário registrado com sucesso",
     * @OA\JsonContent(
     * @OA\Property(property="user", type="object"),
     * @OA\Property(property="token", type="string", example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...")
     * )
     * ),
     * @OA\Response(
     * response=422,
     * description="Dados de validação inválidos",
     * @OA\JsonContent(
     * @OA\Property(property="message", type="string", example="Os dados fornecidos são inválidos."),
     * @OA\Property(property="errors", type="object")
     * )
     * )
     * )
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json(compact('user', 'token'), 201);
    }

    /**
     * @OA\Post(
     * path="/login",
     * operationId="loginUser",
     * tags={"Autenticação"},
     * summary="Autentica um usuário e retorna um token JWT",
     * description="Verifica as credenciais do usuário e, se corretas, gera e retorna um token JWT.",
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"email","password"},
     * @OA\Property(property="email", type="string", format="email", example="victor@example.com"),
     * @OA\Property(property="password", type="string", format="password", example="senha123")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Login bem-sucedido",
     * @OA\JsonContent(
     * @OA\Property(property="token", type="string", example="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...")
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Não autorizado",
     * @OA\JsonContent(
     * @OA\Property(property="error", type="string", example="Unauthorized")
     * )
     * )
     * )
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return response()->json(compact('token'));
    }
}
