<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use OpenAI\Laravel\Facades\OpenAI;

Route::get('/', function () {
    return inertia('Home');
});

/*
Route::post('/api/generate-observations', function (Request $request) {
    $companyName = $request->input('domainName');

    $prompt = "Generera SEO-observationer för {$companyName}.
    Svara i JSON-format med följande nycklar: 
    {
      \"Teknisk\": \"...\",
      \"Onpage\": \"...\",
      \"Offpage\": \"...\"
    }
    Förklara enkelt som om kunden inte kan SEO.";


    $response = $client->chat()->create([
        'model' => 'gpt-4o-mini',
        'messages' => [
            ['role' => 'system', 'content' => 'Du är en SEO-expert.'],
            ['role' => 'user', 'content' => $prompt],
        ],
    ]);

     $text = trim($response->choices[0]->message->content ?? '');

    // Försök extrahera JSON-del (om AI lagt text runt omkring)
    if (preg_match('/\{.*\}/s', $text, $matches)) {
        $text = $matches[0];
    }

    $observations = json_decode($text, true);

    // Normalisera keys till lowercase
    $normalized = [
        'teknisk' => '',
        'onpage' => '',
        'offpage' => '',
    ];
    if (is_array($observations)) {
        foreach ($observations as $key => $value) {
            $normalized[strtolower($key)] = $value;
        }
    }

    return response()->json([
        'observations' => $normalized,
    ]);
});
*/