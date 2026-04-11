<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $limit = min(max((int) $request->query('limit', 100), 1), 200);

        $notifications = $request->user()
            ->notifications()
            ->latest()
            ->limit($limit)
            ->get();

        return response()->json([
            'data' => $notifications,
        ]);
    }
}
