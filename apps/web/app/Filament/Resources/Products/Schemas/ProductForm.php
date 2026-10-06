<?php

namespace App\Filament\Resources\Products\Schemas;

use App\Models\Category;
use App\Models\ProductLink;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ProductForm
{
    public const array PRICE_TIERS = [
        '$' => '$ · Budget',
        '$$' => '$$ · Mid-range',
        '$$$' => '$$$ · Premium',
        '$$$$' => '$$$$ · Top-end',
    ];

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Section::make('Product')
                    ->columns(2)
                    ->components([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (Set $set, ?string $state, string $operation) {
                                if ($operation === 'create') {
                                    $set('slug', Str::slug((string) $state));
                                }
                            }),
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->helperText('Part of the page address. Changing it breaks old links.'),
                        TextInput::make('brand')->required(),
                        Select::make('subcategory_id')
                            ->label('Type')
                            ->required()
                            ->searchable()
                            ->options(fn () => Category::with('subcategories')->orderBy('position')->get()
                                ->mapWithKeys(fn ($c) => [$c->name => $c->subcategories->pluck('name', 'id')->all()])
                                ->all()),
                        Select::make('price_tier')->options(self::PRICE_TIERS)->required(),
                        TextInput::make('rating')
                            ->helperText('Our editorial rating, 1–5.')
                            ->numeric()
                            ->minValue(1)
                            ->maxValue(5)
                            ->step(0.1)
                            ->required(),
                        Toggle::make('featured')->helperText('Show on the home page.'),
                    ]),

                Section::make('Where to buy')
                    ->description('Paste the affiliate link for each retailer. Leave a link empty to show "coming soon".')
                    ->components([
                        Repeater::make('links')
                            ->relationship()
                            ->orderColumn('position')
                            ->hiddenLabel()
                            ->columns(3)
                            ->addActionLabel('Add retailer')
                            ->components([
                                Select::make('retailer')
                                    ->options(ProductLink::RETAILERS)
                                    ->required()
                                    ->distinct(),
                                TextInput::make('url')
                                    ->label('Affiliate URL')
                                    ->url()
                                    ->columnSpan(2),
                            ]),
                    ]),

                Section::make('Review')
                    ->components([
                        TextInput::make('short_description')->required()->maxLength(255),
                        Textarea::make('description')->required()->rows(5),
                        TagsInput::make('pros')->placeholder('Add a pro'),
                        TagsInput::make('cons')->placeholder('Add a con'),
                        KeyValue::make('specs')->keyLabel('Spec')->valueLabel('Value')->reorderable(),
                        TagsInput::make('tags')->helperText('Extra search words, e.g. backpacking, 3-season.'),
                    ]),

                Section::make('Images')
                    ->components([
                        TagsInput::make('images')
                            ->required()
                            ->reorderable()
                            ->placeholder('Add an image URL')
                            ->helperText('Image URLs or paths (e.g. /placeholders/tents.svg). The first is the main image.'),
                    ]),
            ]);
    }
}
