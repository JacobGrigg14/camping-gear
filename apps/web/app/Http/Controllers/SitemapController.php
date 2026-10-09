<?php

namespace App\Http\Controllers;

use App\Services\Catalog;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(Catalog $catalog): Response
    {
        $urls = [
            ['/', 1],
            ...$catalog->categories()->map(fn ($c) => ["/gear/{$c->slug}", 0.8]),
            ...$catalog->products()->orderBy('id')->get()->map(fn ($p) => [$p->path(), 0.6, $p->updated_at]),
            ['/about', 0.3],
            ['/disclosure', 0.3],
            ['/privacy', 0.1],
            ['/terms', 0.1],
        ];

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n"
            .'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";
        foreach ($urls as $entry) {
            [$path, $priority] = $entry;
            $lastmod = isset($entry[2]) ? '<lastmod>'.$entry[2]->toDateString().'</lastmod>' : '';
            $xml .= '  <url><loc>'.e(url()->to($path)).'</loc>'.$lastmod.'<priority>'.$priority.'</priority></url>'."\n";
        }
        $xml .= '</urlset>'."\n";

        return response($xml, 200, ['Content-Type' => 'application/xml']);
    }
}
