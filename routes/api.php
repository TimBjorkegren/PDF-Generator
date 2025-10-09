<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use OpenAI\Laravel\Facades\OpenAI;
use GuzzleHttp\Client;
use Symfony\Component\DomCrawler\Crawler;
use OpenAI\Client as OpenAIClient;
use OpenAI\Factory as OpenAIFactory;


Route::post('/generate-observations', function (Request $request) {
    set_time_limit(120); // säkerställ att PHP inte dör för tidigt
    ini_set('max_execution_time', 120);


    $companyName = $request->input('domainName');
    $myCompanyName = "Våning 18";
    $domainLink = $request->query("domainLink");
     $domainLink = urldecode($domainLink);
    $scrapedData = $request->input('scrapedData', []);

    $client = new \GuzzleHttp\Client([
    'timeout' => 90,
    'connect_timeout' => 15,
    ]);

    $openai = (new OpenAIFactory())
    ->withApiKey(env('OPENAI_API_KEY'))
    ->withHttpClient($client) // 👈 här sätts din egen timeout
    ->make();

    $scrapedTextSummary = "";
    if (!empty($scrapedData)) {
        $scrapedTextSummary = "Här är information från deras sida:\n";
        $scrapedTextSummary .= "Title: " . ($scrapedData['meta']['title'] ?? 'N/A') . "\n";
        $scrapedTextSummary .= "Description: " . ($scrapedData['meta']['description'] ?? 'N/A') . "\n";
        $scrapedTextSummary .= "H1: " . implode(', ', $scrapedData['headings']['h1'] ?? []) . "\n";
        $scrapedTextSummary .= "H2: " . implode(', ', $scrapedData['headings']['h2'] ?? []) . "\n";
        $scrapedTextSummary .= "Paragraphs: " . implode(' | ', $scrapedData['paragraphs'] ?? []) . "\n";
    }

    $prompt = "Generera SEO-observationer för {$companyName}.
    Använd dig utav {$scrapedTextSummary} för att besvara punkter så vi kan göra det så personligt som möjligt, markera tydligt när du använder dig utav den information så jag kan se ifall det fungerar.
    Svara i JSON-format med följande nycklar: 
    {
      \"Teknisk\": \"...\",
      \"Onpage\": \"...\",
      \"Offpage\": \"...\",
      \"Ready\": \"...\",
      \"Q1_Seo_Teknisk\": \"...\",
      \"Q1_Nyckelord_Atgard\": \"...\",
      \"Q1_Konkurrent_Kpi\": \"...\",
      \"Q1_Spårning_Offpage\": \"...\",
      \"Q1_Title_Meta_Head_Url\": \"...\",
      \"Q1_Sajtstruktur_Länkar\": \"...\",
      \"Q1_Innehållsplan\": \"...\",
      \"Q1_Offpage\": \"...\",
      \"Q2_Publicera_Art_Guide\": \"...\",
      \"Q2_Uppdatera_Innehåll\": \"...\",
      \"Q2_Bygga_Authority\": \"...\",
      \"Q2_Länkstrategi_Outreach\": \"...\",
      \"Q2_Offpage\": \"...\",
      \"Q3_Nya_Landningssidor\": \"...\",
      \"Q3_Lokal_Seo\": \"...\",
      \"Q3_Cro\": \"...\",
      \"Q3_Schema_Markup_Rich_Results\": \"...\",
      \"Q3_Offpage\": \"...\",
      \"Q4_Utvärdera_rankingar_trafik\": \"...\",
      \"Q4_Skapa_Avancerat_Innehåll\": \"...\",
      \"Q4_Bygga_Starkare_Länkar\": \"...\",
      \"Q4_Utbildning_Kund\": \"...\",
      \"Q4_Offpage\": \"...\",
      \"Q4_Arsrapport\": \"...\",
      \"Q4_Roi_Analys\": \"...\",
      \"Q4_Strategimöte_Plan\": \"...\",
    }

    Instruktioner:
    1. Förklara allt enkelt, som om kunden aldrig har jobbat med SEO.
    2. Använd inga programmeringstermer – det ska vara lätt att förstå.
    3. Under Ready skriv en personlig, varm och förtroendeingivande inbjudan där ni försöker sälja in era tjänster.  
    Använd gärna företagets namn {$companyName} och vårt företagsnamn {$myCompanyName}.  
    Avsluta med en öppen fråga som uppmuntrar till nästa steg, t.ex. boka möte.
    4. För varje Q1, Q2, Q3, Q4 nedan, förklara varför det är viktigt, dessa är
    våra huvudaktiviteter som ingår så vi ska förklara till en kund vad som sker där, och sammanfatta det så de förstår.
    
    Viktigt:
    - För alla Q2, Q3 och Q4, skriv längre, utförliga men enkla förklaringar, skriv de gärna långa men med bra information. Du kan ge några exempel med. 
    - Undvik tekniska ord.
    - Prioritera tydlighet och värme framför korthet.
    - Undvik att skriva Q1 för långa.
    
    
    Q1_Seo_Teknisk: SEO-audit och teknisk analys:
    Q1_Nyckelord_Åtgärd: Nyckelordsanalys och Åtgärdsplan:
    Q1_Konkurrent_Kpi: Kokurrentanalys och KPI-sättning:
    Q1_Spårning_Offpage: spårning (GA4/GSC) och Offpage:
    Q1_Title_Meta_Head_Url: Optimera titlar, metabeskrivningar, headings och URL-struktur:
    Q1_Sajtstruktur_Länkar: Skapa sajtstruktur och interna länkar:
    Q1_Innehållsplan: Innehållsplan för 12 mån:
    Q1_Offpage: Offpage: 
    Q2_Publicera_Art_Guide: Publicera artiklar/guider:
    Q2_Uppdatera_Innehåll: Uppdatera befintligt innehåll:
    Q2_Bygga_Authority: Bygga topical authority:
    Q2_Länkstrategi_Outreach: Starta länkstrategi och outreach
    Q2_Offpage: Offpage:
    Q3_Nya_Landningssidor: Nya landningssidor:
    Q3_Lokal_Seo: lokal SEO (om relevant):
    Q3_Cro: CRO (A/B-test, UX):
    Q3_Schema_Markup_Rich_Results: schema markup & rich results:
    Q3_Offpage: Offpage:
    Q4_Utvärdera_rankingar_trafik: Utvärdera rankingar & trafik:
    Q4_Skapa_Avancerat_Innehåll: Skapa avancerat innehåll (case studies, white papers):
    Q4_Bygga_Starkare_Länkar: Bygga starkare länkar:
    Q4_Utbildning_Kund: eventuellt utbildning för kund:
    Q4_Offpage: Offpage:
    Q4_Arsrapport: Årsrapport med resultat mot KPI:er:
    Q4_Roi_Analys: ROI analys:
    Q4_Strategimöte_Plan: Strategi och plan för nästa år:
    ";
    

    $response = $openai->chat()->create([
        'model' => 'gpt-4.1',
        'messages' => [
            ['role' => 'system', 'content' => 'Du är en SEO-expert. Skriv utförliga, varma och pedagogiska observationer för kunder. Följ strikt JSON-strukturen som anges i user-meddelandet.'],
            ['role' => 'user', 'content' => $prompt],
        ],
    ]);

    $text = trim($response->choices[0]->message->content ?? '');

    // Försök extrahera JSON-del (om AI lagt text runt omkring)
    if (preg_match('/\{.*\}/s', $text, $matches)) {
        $text = $matches[0];
    }

    $observations = json_decode($text, true);

    $normalized = [
        'teknisk' => '',
        'onpage' => '',
        'offpage' => '',
        'ready' => '',
        'q1_seo_teknisk' => '',
        'q1_nyckelord_atgard' => '',
        'q1_konkurrent_kpi' => '',
        'q1_spårning_offpage' => '',
        'q1_title_meta_head_url' => '',
        'q1_sajtstruktur_länkar' => '',
        'q1_innehållsplan' => '',
        'q1_offpage' => '',
        'q2_publicera_art_guide' => '',
        'q2_uppdatera_innehåll' => '',
        'q2_bygga_authority' => '',
        'q2_länkstrategi_outreach' => '',
        'q2_offpage' => '',
        'q3_nya_landningssidor' => '',
        'q3_lokal_seo' => '',
        'q3_cro' => '',
        'q3_schema_markup_rich_results' => '',
        'q3_offpage' => '',
        'q4_utvärdera_rankingar_trafik' => '',
        'q4_skapa_avancerat_innehåll' => '',
        'q4_bygga_starkare_länkar' => '',
        'q4_utbildning_kund' => '',
        'q4_offpage' => '',
        'q4_arsrapport' => '',
        'q4_roi_analys' => '',
        'q4_strategimöte_plan' => '',
        
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


Route::get('/favicon', function (Request $request) {
    $url = $request->query('url');

    if (!$url) {
        return response()->json(['error' => 'URL is required'], 400);
    }

    try {
        $domain = parse_url($url, PHP_URL_HOST);
        $faviconUrl = "https://www.google.com/s2/favicons?sz=64&domain={$domain}";

        // Fetch the favicon from Google S2
        $response = Http::get($faviconUrl);
        if ($response->ok()) {
            $base64 = base64_encode($response->body());
            return response()->json(['favicon' => "data:image/png;base64,{$base64}"]);
        } else {
            return response()->json(['favicon' => null]);
        }
    } catch (\Exception $e) {
        return response()->json(['favicon' => null]);
    }
});


Route::get('/scrape-example', function (Request $request) {
    $domainLink = urldecode($request->query("domainLink"));

    $client = new Client([
        'timeout' => 30, // max 30 sek för scraping
        'headers' => ['User-Agent' => 'Mozilla/5.0']
    ]);

    try {
        $response = $client->request('GET', $domainLink);
        $html = (string) $response->getBody();
    } catch (\Exception $e) {
        return response()->json(['error' => 'Could not scrape page: ' . $e->getMessage()], 500);
    }

    $crawler = new Crawler($html);

    $data = [
        'meta' => [
            'title' => $crawler->filter('title')->count() ? $crawler->filter('title')->text() : null,
            'description' => $crawler->filter('meta[name="description"]')->count() ? $crawler->filter('meta[name="description"]')->attr('content') : null
        ],
        'headings' => [
            'h1' => $crawler->filter('h1')->each(fn($node) => $node->text()),
            'h2' => $crawler->filter('h2')->each(fn($node) => $node->text()),
            'h3' => $crawler->filter('h3')->each(fn($node) => $node->text()),
        ],
        'paragraphs' => $crawler->filter('p')->each(fn($node) => $node->text()),
        'links' => $crawler->filter('a')->each(fn($node) => ['href' => $node->attr('href'), 'text' => $node->text()]),
        'images' => $crawler->filter('img')->each(fn($node) => ['src' => $node->attr('src'), 'alt' => $node->attr('alt')]),
        'cta' => $crawler->filter('a[class*="btn"], a[class*="cta"]')->each(fn($node) => ['text' => $node->text(), 'href' => $node->attr('href')]),
    ];

    return response()->json($data);
});

