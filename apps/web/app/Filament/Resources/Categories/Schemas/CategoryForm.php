<?php

namespace App\Filament\Resources\Categories\Schemas;

use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Section::make()
                    ->columns(2)
                    ->components([
                        TextInput::make('name')->required(),
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->helperText('Part of the page address (/gear/<slug>). Changing it breaks old links.'),
                        TextInput::make('tagline')->required(),
                        TextInput::make('image')->required()->helperText('Image URL or path for the home page tile.'),
                        Textarea::make('description')->required()->rows(3)->columnSpanFull(),
                        TextInput::make('position')->numeric()->default(0)->helperText('Lower comes first.'),
                    ]),
                Section::make('Types')
                    ->description('Subcategories shown as filters on the category page.')
                    ->components([
                        Repeater::make('subcategories')
                            ->relationship()
                            ->orderColumn('position')
                            ->hiddenLabel()
                            ->columns(2)
                            ->addActionLabel('Add type')
                            ->components([
                                TextInput::make('name')->required(),
                                TextInput::make('slug')->required()->distinct(),
                            ]),
                    ]),
            ]);
    }
}
