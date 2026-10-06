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
            ...$catalog->products()->orderBy('id')->get()->map(fn ($p) => [$p->path(), 0.6]),
            ['/about', 0.3],
            ['/disclosure', 0.3],
        ];

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n"
            .'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'."\n";
        foreach ($urls as [$path, $priority]) {
            $xml .= '  <url><loc>'.e(url()->to($path)).'</loc><priority>'.$priority.'</priority></url>'."\n";
        }
        $xml .= '</urlset>'."\n";

        return response($xml, 200, ['Content-Type' => 'application/xml']);
    }
}
