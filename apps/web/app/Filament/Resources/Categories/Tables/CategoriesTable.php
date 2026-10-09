<?php

namespace App\Filament\Resources\Categories\Tables;

use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CategoriesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('position')
            ->reorderable('position')
            ->columns([
                TextColumn::make('name'),
                TextColumn::make('slug'),
                TextColumn::make('subcategories_count')->counts('subcategories')->label('Types'),
                TextColumn::make('tagline')->wrap(),
            ])
            ->recordActions([
                EditAction::make(),
            ]);
    }
}
